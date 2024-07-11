'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { getTeams, GetTeamsResponse } from '@/app/api/departments/get-teams';
import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import { updateProject } from '@/app/api/projetos/update-project';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  dialogCloseFn,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    nome: z
      .string()
      .min(1, { message: 'O nome do projeto deve ser informado.' }),
    datas: z
      .object({
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional()
      })
      .optional(),
    descricao: z.string().optional(),
    equipes: z
      .array(z.string())
      .min(1, { message: 'Selecione pelo menos uma equipe.' }),
    responsaveis: z
      .array(z.string())
      .min(1, { message: 'Selecione pelo menos um responsável.' }),
    prioridade: z.string().min(1, { message: 'Selecione a prioridade.' })
  })
  .superRefine(({ datas }, refinementContext) => {
    if (datas?.from && !datas?.to) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.invalid_date,
        path: ['datas']
      });
    }
  });

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: Member[];
}

export interface UpdateProjectFormProps {
  projectId: number;
  open: boolean;
}

export function UpdateProjectForm({ projectId, open }: UpdateProjectFormProps) {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  });

  const { data: allTeams = [] } = useQuery<GetTeamsResponse[]>({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
    enabled: open && !!role && role === 'Administrador'
  });

  const { data: departmentTeams = [] } = useQuery<
    GetTeamsByDepartmentResponse[]
  >({
    queryKey: ['teams', codDepartment],
    queryFn: () => getTeamsByDepartment({ codDepartment }),
    enabled: open && !!role && role !== 'Administrador'
  });

  const teams = role === 'Administrador' ? allTeams : departmentTeams;

  const teamsList: Team[] = teams.map((team) => ({
    ID: team.ID,
    NOME: team.NOME,
    MEMBROS: team.MEMBROS
  }));

  const {
    NOME: currentName = '',
    DATA_INICIO: currentInitialDate = '',
    DATA_FIM: currentFinalDate = '',
    DESCRICAO: currentDescription = '',
    PRIORIDADE: currentPriority = '',
    ATRASADO: currentDelayedStatus = '',
    EQUIPES: rowTeams = []
  } = project || {};

  const currentTeams = rowTeams.flatMap((team: Team) => team.ID.toString());

  const rowMembers: Member[] = rowTeams.flatMap((team) =>
    team.MEMBROS.map((member: Member) => ({
      CHAPA: member.CHAPA,
      NOME: member.NOME
    }))
  );
  const currentMembers = rowMembers.flatMap((member: Member) => member.CHAPA);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      nome: currentName,
      datas:
        currentInitialDate && currentFinalDate
          ? {
              from: new Date(currentInitialDate),
              to: new Date(currentFinalDate)
            }
          : undefined,
      descricao: currentDescription ?? undefined,
      equipes: currentTeams,
      responsaveis: currentMembers,
      prioridade: currentPriority
    }
  });

  const [initialResponsaveisSet, setInitialResponsaveisSet] = useState(false);
  const teamsValue = form.watch('equipes');

  const filteredMembers = teamsList
    .filter((team) => teamsValue.includes(team.ID.toString()))
    .flatMap((team) => team.MEMBROS);

  useEffect(() => {
    if (!initialResponsaveisSet && project) {
      form.setValue('responsaveis', currentMembers);
      setInitialResponsaveisSet(true);
    }
  }, [project, currentMembers, initialResponsaveisSet, form]);

  useEffect(() => {
    if (initialResponsaveisSet) {
      const currentResponsaveis = form.getValues('responsaveis');
      const updatedResponsaveis = currentResponsaveis.filter((responsavel) =>
        filteredMembers.some((member: Member) => member.CHAPA === responsavel)
      );
      form.setValue('responsaveis', updatedResponsaveis);
    }
  }, [teamsValue, filteredMembers, form, initialResponsaveisSet]);

  const removed: {
    teamsId: string[];
    chapas: string[];
  } = {
    teamsId: [],
    chapas: []
  };

  const added: {
    teamsId: string[];
    chapas: string[];
  } = {
    teamsId: [],
    chapas: []
  };

  const queryClient = useQueryClient();

  const { mutateAsync: updateProjectFn } = useMutation({
    mutationFn: updateProject,
    onSuccess() {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-department', codDepartment]
        });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-team', chapa]
        });
        queryClient.invalidateQueries({
          queryKey: ['project', projectId]
        });
      }, 1000);
    }
  });

  async function onSubmit(projectData: z.infer<typeof formSchema>) {
    // console.log(projectData);

    currentTeams.forEach((team) => {
      if (!form.getValues('equipes').includes(team)) {
        removed.teamsId.push(team);
      }
    });

    currentMembers.forEach((member) => {
      if (!form.getValues('responsaveis').includes(member)) {
        removed.chapas.push(member);
      }
    });

    form.getValues('equipes').forEach((team) => {
      if (!currentTeams.includes(team)) {
        added.teamsId.push(team);
      }
    });

    form.getValues('responsaveis').forEach((member) => {
      if (!currentMembers.includes(member)) {
        added.chapas.push(member);
      }
    });

    const dataInicio: string | null | undefined =
      projectData.datas?.from !== undefined && currentInitialDate === null
        ? format(projectData.datas.from, 'yyyy-MM-dd', {
            locale: ptBR
          })
        : projectData.datas?.from !== undefined &&
            currentInitialDate &&
            format(projectData.datas.from, 'yyyy-MM-dd', { locale: ptBR }) !==
              currentInitialDate.split('T', 1)[0]
          ? format(projectData.datas.from, 'yyyy-MM-dd', {
              locale: ptBR
            })
          : projectData.datas?.from !== undefined &&
              currentInitialDate &&
              format(projectData.datas.from, 'yyyy-MM-dd', { locale: ptBR }) ===
                currentInitialDate.split('T', 1)[0]
            ? undefined
            : null;
    const dataFim: string | null | undefined =
      projectData.datas?.to !== undefined && currentFinalDate === null
        ? format(projectData.datas.to, 'yyyy-MM-dd', {
            locale: ptBR
          })
        : projectData.datas?.to !== undefined &&
            currentFinalDate &&
            format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR }) !==
              currentFinalDate.split('T', 1)[0]
          ? format(projectData.datas.to, 'yyyy-MM-dd', {
              locale: ptBR
            })
          : projectData.datas?.to !== undefined &&
              currentFinalDate &&
              format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR }) ===
                currentFinalDate.split('T', 1)[0]
            ? undefined
            : null;
    const todayDate = format(new Date(), 'yyyy-MM-dd');
    const updateDelayedStatus: string | undefined =
      currentDelayedStatus === 'S' && dataFim && dataFim >= todayDate
        ? 'N'
        : currentDelayedStatus === 'N' && dataFim && dataFim < todayDate
          ? 'S'
          : undefined;

    try {
      await updateProjectFn({
        projectId: projectId,
        nome: projectData.nome !== currentName ? projectData.nome : undefined,
        dataInicio: dataInicio,
        dataFim: dataFim,
        descricao:
          projectData.descricao !== currentDescription
            ? projectData.descricao
            : undefined,
        prioridade:
          projectData.prioridade !== currentPriority
            ? projectData.prioridade
            : undefined,
        removed:
          removed.chapas.length > 0 || removed.teamsId.length > 0
            ? removed
            : undefined,
        added:
          added.chapas.length > 0 || added.teamsId.length > 0
            ? added
            : undefined,
        usuInclusao:
          added.chapas.length > 0 || added.teamsId.length > 0
            ? session?.user.CODUSUARIO
            : undefined,
        usuAtualizacao: session?.user.CODUSUARIO
          ? session?.user.CODUSUARIO
          : 'MM_WEB',
        atrasado: updateDelayedStatus ?? updateDelayedStatus
      });
      toast.success('Projeto atualizado com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao atualizar o projeto, contate o administrador.');
      dialogCloseFn();
    }
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Atualizar projeto</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo com as informações do projeto.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome do projeto <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do projeto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datas"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Datas</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-60 justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarDays className="mr-2 size-4" />
                        {field.value?.from && field.value?.to
                          ? `${format(field.value.from, 'P', {
                              locale: ptBR
                            })} a ${format(field.value.to, 'P', {
                              locale: ptBR
                            })}`
                          : field.value?.from
                            ? `${format(field.value.from, 'P', {
                                locale: ptBR
                              })} a `
                            : 'Selecione as datas'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto p-0">
                      <Calendar
                        mode="range"
                        selected={{
                          from: field.value?.from,
                          to: field.value?.to
                        }}
                        onSelect={(range) => {
                          field.onChange({
                            from: range?.from,
                            to: range?.to
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {field.value?.from && !field.value.to ? (
                  <span className="text-sm font-medium text-destructive">
                    Selecione a data final
                  </span>
                ) : null}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva o projeto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Equipes <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={teamsList.map((team: Team) => ({
                      value: team.ID.toString(),
                      label: team.NOME,
                      key: team.ID
                    }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    popoverSide="top"
                    placeholder="Selecione a(s) equipe(s)"
                    disabled={role === 'Coordenador'}
                    modalPopover={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsaveis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Responsáveis <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={filteredMembers.map((member: Member) => ({
                      value: member.CHAPA,
                      label: member.NOME,
                      key: member.CHAPA
                    }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder={
                      teamsValue.length === 0
                        ? 'Selecione a(s) equipe(s)'
                        : 'Selecione os responsáveis'
                    }
                    disabled={teamsValue.length === 0}
                    modalPopover={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prioridade <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Baixa">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowDown className="size-4" />
                          </div>
                          <span>Baixa</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Média">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowRight className="size-4" />
                          </div>
                          <span>Média</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Alta">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowUp className="size-4" />
                          </div>
                          <span>Alta</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <DialogFooter>
              <Button
                disabled={
                  (form.formState.isSubmitting, !form.formState.isDirty)
                }
                type="submit"
              >
                Atualizar projeto
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
