'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import { createProject } from '@/app/api/projetos/create-project';
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

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: [];
}

interface Member {
  CHAPA: string;
  NOME: string;
}

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

export function CreateProjectForm() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', codDepartment],
    queryFn: () => getTeamsByDepartment({ codDepartment }),
    enabled: !!codDepartment
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      datas: {
        from: undefined,
        to: undefined
      },
      descricao: '',
      equipes: [],
      responsaveis: [],
      prioridade: ''
    }
  });

  const teamsList: Team[] = teams.map((team) => ({
    ID: team.ID,
    NOME: team.NOME,
    MEMBROS: team.MEMBROS
  }));

  const teamsValue = form.watch('equipes');

  const filteredMembers = teamsList
    .filter((team) => teamsValue.includes(team.ID.toString()))
    .flatMap((team) => team.MEMBROS);

  useEffect(() => {
    const currentResponsaveis = form.getValues('responsaveis');

    const updatedResponsaveis = currentResponsaveis.filter((responsavel) =>
      filteredMembers.some((member: Member) => member.CHAPA === responsavel)
    );

    form.setValue('responsaveis', updatedResponsaveis);
  }, [form, teamsList, teamsValue, filteredMembers]);

  const queryClient = useQueryClient();

  const { mutateAsync: createProjectFn } = useMutation({
    mutationFn: createProject,
    onSuccess() {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['projects', codDepartment] });
      queryClient.invalidateQueries({
        queryKey: ['coordinator-projects', chapa]
      });
    }
  });

  async function onSubmit(projectData: z.infer<typeof formSchema>) {
    console.log(projectData);

    const equipes = projectData.equipes.map((equipe) => parseInt(equipe, 10));

    try {
      await createProjectFn({
        nome: projectData.nome,
        dataInicio: projectData.datas?.from
          ? format(projectData.datas.from, 'yyyy-MM-dd', {
              locale: ptBR
            })
          : undefined,
        dataFim: projectData.datas?.to
          ? format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR })
          : undefined,
        descricao: projectData.descricao ?? undefined,
        equipesId: equipes,
        chapas: projectData.responsaveis,
        prioridade: projectData.prioridade,
        codDepartamento: codDepartment,
        usuInclusao: session?.user.CODUSUARIO ?? 'A_MMWEB'
      });

      toast.success('Projeto criado com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao criar o projeto, contate o administrador.');
      dialogCloseFn();
    }
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Criar projeto</DialogTitle>
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
              <Button disabled={form.formState.isSubmitting} type="submit">
                Criar projeto
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
