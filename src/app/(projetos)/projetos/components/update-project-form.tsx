'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { departments } from '@/app/api/data/data';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { updateProject } from '@/app/api/projetos/update-project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getProfile } from '@/app/api/get-profile';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';

interface Member {
  name: string;
}

interface SubTeam {
  name: string;
  members?: Member[];
}

interface Team {
  name: string;
  subTeams?: SubTeam[];
}

interface Department {
  name: string;
  teams?: Team[];
}

const formSchema = z.object({
  nome: z.string().min(1, { message: 'O nome do projeto deve ser informado.' }),
  datas: z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
  }),
  descricao: z.string().min(1, { message: 'Descreva o projeto.' }),
  equipes: z
    .array(z.string()).min(1, { message: 'Selecione pelo menos uma equipe' }),
  responsaveis: z
    .array(z.string()).min(1, { message: 'Selecione pelo menos um responsável' }),
  prioridade: z.string()
});

export interface UpdateProjectFormProps {
  projectId: string;
  open: boolean;
}

export function UpdateProjectForm({projectId, open}: UpdateProjectFormProps) {
  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: open
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: open
  });

  const queryClient = useQueryClient();

  const [range, setRange] = useState<DateRange | undefined>();
  const [teams, setTeams] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [membersList, setMembersList] = useState<string[]>([]);
  
  useEffect(() => {
    setTeams(project?.EQUIPES.split('; ') || [])
    setMembers(project?.RESPONSAVEIS.split(', ') || [])
    handleTeamsChange(project?.EQUIPES.split('; ') || [])
  }, [project])

  const teamsList: string[] = departments.flatMap((department: Department) => {
    return (
      department.teams?.flatMap((team: Team) => {
        return (
          team.subTeams?.map((subTeam: SubTeam) => {
            return subTeam?.name || '';
          }) || []
        );
      }) || []
    );
  });

  const handleTeamsChange = (selectedTeams: string[]) => {
    const filteredMembers: string[] = departments.flatMap(
      (department: Department) =>
        department.teams?.flatMap(
          (team: Team) =>
            team.subTeams
              ?.filter((subTeam: SubTeam) =>
                selectedTeams.includes(subTeam.name || '')
              )
              .flatMap(
                (subTeam: SubTeam) =>
                  subTeam.members?.map((member: Member) => member.name || '') ||
                  []
              ) || []
        ) || []
    );

    const removedTeam = teams.filter(team => !selectedTeams.includes(team));
    if (removedTeam.length > 0) {
      const updatedMembers = members.filter(member => filteredMembers.includes(member));
      setMembers(updatedMembers);
    }

    setMembersList(filteredMembers);
  };

  const dataInicio: string = new Date().toString();
  const dataFim: string = new Date(new Date().setDate(new Date().getDate() + 1)).toString();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      nome: project?.NOME ?? '',
      datas: {
        from: project?.DATA_INICIO ? new Date(project?.DATA_INICIO) : new Date(dataInicio),
        to: project?.DATA_FIM ? new Date(project?.DATA_FIM) : new Date(dataFim)
      },
      descricao: project?.DESCRICAO ?? '',
      equipes: project?.EQUIPES.split('; ') || [],
      responsaveis: project?.RESPONSAVEIS.split(', ') || [],
      prioridade: project?.PRIORIDADE || ''
    }
  })

  const { mutateAsync: updateProjectFn } = useMutation({
    mutationFn: updateProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  })

  async function onSubmit(projectData: z.infer<typeof formSchema>) {
    try {
      await updateProjectFn({
        projectId: projectId,
        nome: projectData.nome,
        dataInicio: format(projectData.datas.from, 'yyyy-MM-dd', { locale: ptBR }),
        dataFim: format(projectData.datas.to, 'yyyy-MM-dd', { locale: ptBR }),
        descricao: projectData.descricao,
        equipes: projectData.equipes,
        responsaveis: projectData.responsaveis,
        prioridade: projectData.prioridade,
        usuInclusao: profile ? profile?.codUsuario : 'TL_THIAGO'
      })
      
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
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
                        )}>
                          <CalendarDays className='mr-2 size-4' />
                          {field.value.from && field.value.to
                            ? `${format(field.value.from, 'P', {
                                locale: ptBR
                              })} a ${format(field.value.to, 'P', {
                                locale: ptBR
                              })}`
                            : 'Selecione as datas'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='flex w-auto p-0'>
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
                          })
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {form.formState.errors.datas?.from ? (
                  form.formState.errors.datas?.from.type === 'invalid_date' 
                  ? <span className="text-sm font-medium text-destructive">As datas devem ser selecionadas</span>
                  : <span className="text-sm font-medium text-destructive">{form.formState.errors.datas?.from.message}</span>
                ) : (
                    form.formState.errors.datas?.to?.type === 'invalid_date' 
                    ? <span className="text-sm font-medium text-destructive">Selecione a data final</span>
                    : <span className="text-sm font-medium text-destructive">{form.formState.errors.datas?.to?.message}</span>
                  )
                }
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
                  <Textarea placeholder='Descreva o projeto' {...field} />
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
                    selected={teams}
                    onChange={(selectedTeams) => {
                      field.onChange(selectedTeams);
                      setTeams(selectedTeams);
                      handleTeamsChange(selectedTeams);
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
                    selected={members}
                    onChange={(members) => {
                      field.onChange(members);
                      setMembers(members);
                    }}
                    className="w-96"
                    placeholder={
                      teams.length === 0
                        ? 'Selecione a(s) equipe(s)'
                        : 'Selecione os responsáveis'
                    }
                    disabled={teams.length === 0}
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Baixa">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowDown className='size-4' />
                          </div>
                          <span>Baixa</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Média">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowRight className='size-4' />
                          </div>
                          <span>Média</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Alta">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowUp className='size-4' />
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
              <Button disabled={form.formState.isSubmitting} type="submit">Atualizar projeto</Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
