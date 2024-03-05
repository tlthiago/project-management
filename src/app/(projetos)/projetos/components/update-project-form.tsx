'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
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

const formSchema = z.object({
  nome: z.string().min(1, { message: 'O nome do projeto deve ser informado.' }),
  datas: z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
  }),
  descricao: z.string().min(1, { message: 'Descreva o projeto.' }),
  equipes: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos uma equipe.' }),
  responsaveis: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um responsável.' }),
  prioridade: z.string().min(1, { message: 'Selecione a prioridade.' })
});

export interface UpdateProjectFormProps {
  projectId: string;
  open: boolean;
}

export function UpdateProjectForm({ projectId, open }: UpdateProjectFormProps) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: open
  });

  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', department],
    queryFn: () => getTeamsByDepartment({ department }),
    enabled: open
  });

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department }),
    enabled: open
  });

  const currentTeamsIdString = project?.EQUIPES_ID.split(',') || [];
  const teamsIdNumber: number[] = currentTeamsIdString.map((teamId) =>
    parseInt(teamId, 10)
  );

  const [team, setTeam] = useState<string[]>([]);
  const [teamsId, setTeamsId] = useState<number[]>([]);
  const [membersList, setMembersList] = useState<string[]>([]);
  const [member, setMember] = useState<string[]>([]);

  useEffect(() => {
    setTeam(project?.EQUIPES.split(',') || []);
    setTeamsId(teamsIdNumber);
    setMember(project?.MEMBROS.split(',') || []);
    handleTeamsChange(project?.EQUIPES.split(',') || []);
  }, [project]);

  const dataInicio: string = range?.to
    ? range.to.toString()
    : new Date().toString();
  const dataFim: string = range?.from
    ? range?.from.toString()
    : new Date(new Date().setDate(new Date().getDate() + 1)).toString();

  const teamsList: string[] = teams.map((team) => team.NOME);

  const handleTeamsChange = (teamValue: string[]) => {
    const filteredMembers: string[] = [];
    const selectedTeamsId: number[] = [];

    teams.map((team) => {
      teamValue.map((selectedTeam) => {
        if (selectedTeam === team.NOME) {
          selectedTeamsId.push(team.ID);
          const teamMembers: string[] = team.MEMBROS.split(', ');
          filteredMembers.push(...teamMembers);
        }
      });
    });

    const removedTeam = team.filter((teamName) => {
      return !teamValue.includes(teamName);
    });

    if (removedTeam.length > 0) {
      const updatedMembers = member.filter((member) =>
        filteredMembers.includes(member)
      );
      setMember(updatedMembers);
    }

    setMembersList(filteredMembers);
    setTeamsId(selectedTeamsId);
  };

  const membersChapas: string[] = [];

  member.map((selectedMember) => {
    members.map((member) => {
      if (selectedMember === member.NOME) {
        membersChapas.push(member.CHAPA);
      }
    });
  });

  const removed: {
    teamsId: number[];
    chapas: string[];
  } = {
    teamsId: [],
    chapas: []
  };

  teamsIdNumber.forEach((teamId) => {
    if (!teamsId.includes(teamId)) {
      removed.teamsId?.push(teamId);
    }
  });

  const currentChapas = project?.CHAPAS.split(',') || [];

  currentChapas.forEach((chapa) => {
    if (!membersChapas.includes(chapa)) {
      removed.chapas?.push(chapa);
    }
  });

  const added: {
    teamsId: number[];
    chapas: string[];
  } = {
    teamsId: [],
    chapas: []
  };

  teamsId.forEach((teamId) => {
    if (!teamsIdNumber.includes(teamId)) {
      added.teamsId?.push(teamId);
    }
  });

  membersChapas.forEach((chapa) => {
    if (!currentChapas.includes(chapa)) {
      added.chapas.push(chapa);
    }
  });

  const formValues = {
    nome: project?.NOME ?? '',
    datas: {
      from: project?.DATA_INICIO
        ? new Date(project?.DATA_INICIO)
        : new Date(dataInicio),
      to: project?.DATA_FIM ? new Date(project?.DATA_FIM) : new Date(dataFim)
    },
    descricao: project?.DESCRICAO ?? '',
    equipes: project?.EQUIPES.split(',') || [],
    responsaveis: project?.MEMBROS.split(',') || [],
    prioridade: project?.PRIORIDADE || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: formValues
  });

  useEffect(() => {
    const teamValue = form.watch('equipes');
    setTeam(teamValue);
    handleTeamsChange(teamValue);
  }, [form.watch('equipes')]);

  const queryClient = useQueryClient();

  const { mutateAsync: updateProjectFn } = useMutation({
    mutationFn: updateProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  async function onSubmit(projectData: z.infer<typeof formSchema>) {
    try {
      await updateProjectFn({
        projectId: projectId,
        nome: projectData.nome !== project?.NOME ? projectData.nome : undefined,
        dataInicio:
          format(projectData.datas.from, 'yyyy-MM-dd', { locale: ptBR }) !==
          project?.DATA_INICIO.split('T', 1)[0]
            ? format(projectData.datas.from, 'yyyy-MM-dd', { locale: ptBR })
            : undefined,
        dataFim:
          format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR }) !==
          project?.DATA_FIM.split('T', 1)[0]
            ? format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR })
            : undefined,
        descricao:
          projectData.descricao !== project?.DESCRICAO
            ? projectData.descricao
            : undefined,
        prioridade:
          projectData.prioridade !== project?.PRIORIDADE
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
            : undefined
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
          Preencha os campos abaixo com as informações do projeto
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do projeto</FormLabel>
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
                        {field.value.from && field.value.to
                          ? `${format(field.value.from, 'P', {
                              locale: ptBR
                            })} a ${format(field.value.to, 'P', {
                              locale: ptBR
                            })}`
                          : 'Selecione as datas'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto p-0">
                      <Calendar
                        mode="range"
                        selected={{
                          from: field.value.from,
                          to: field.value.to
                        }}
                        onSelect={(range) => {
                          field.onChange({
                            from: range?.from,
                            to: range?.to
                          });
                          setRange({
                            from: range?.from,
                            to: range?.to
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {form.formState.errors.datas?.from ? (
                  form.formState.errors.datas?.from.type == 'invalid_date' ? (
                    <span className="text-sm font-medium text-destructive">
                      As datas devem ser selecionadas.
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-destructive">
                      {form.formState.errors.datas?.from.message}
                    </span>
                  )
                ) : form.formState.errors.datas?.to?.type == 'invalid_date' ? (
                  <span className="text-sm font-medium text-destructive">
                    Selecione a data final.
                  </span>
                ) : (
                  <span className="text-sm font-medium text-destructive">
                    {form.formState.errors.datas?.to?.message}
                  </span>
                )}
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
                <FormLabel>Equipes</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={teamsList.map((subTeamName, index) => ({
                      value: subTeamName,
                      label: subTeamName,
                      key: index
                    }))}
                    selected={team}
                    onChange={(selectedTeams) => {
                      field.onChange(selectedTeams);
                    }}
                    className="max-w-[462px]"
                    placeholder="Selecione a(s) equipe(s)"
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
                <FormLabel>Responsáveis</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={membersList.map((memberName, index) => ({
                      value: memberName,
                      label: memberName,
                      key: index
                    }))}
                    selected={member}
                    onChange={(members) => {
                      field.onChange(members);
                      setMember(members);
                    }}
                    className="w-96"
                    placeholder={
                      teams.length === 0
                        ? 'Selecione a(s) equipe(s)'
                        : 'Selecione os responsáveis'
                    }
                    disabled={team.length === 0}
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
                <FormLabel>Prioridade</FormLabel>
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
