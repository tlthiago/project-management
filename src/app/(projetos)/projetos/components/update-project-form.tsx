'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useController, useForm } from 'react-hook-form';
import * as z from 'zod';

import { departments } from '@/app/api/data/data';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  dialogCloseFn
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
import { updateProject } from '@/app/api/projetos/update-project';
import { useMutation, useQuery } from '@tanstack/react-query';
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

const projectSchema = z.object({
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

type ProjectSchema = z.infer<typeof projectSchema>;

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

  const dataInicioFormatada = project?.DATA_INICIO && new Date(project.DATA_INICIO)

  console.log(project?.DATA_INICIO);
  console.log(project?.DATA_FIM);
  console.log(dataInicioFormatada);

  const [range, setRange] = useState<DateRange | undefined>({
    from: project?.DATA_INICIO ? new Date(project.DATA_INICIO) : new Date(),
    to: project?.DATA_FIM ? new Date(project.DATA_FIM) : new Date(new Date().setDate(new Date().getDate() + 1))
  });

  const teamsArray: string[] = project?.EQUIPES.split(', ') || [];
  const membersArray: string[] = project?.RESPONSAVEIS.split(', ') || []
  
  const [teams, setTeams] = useState<string[]>(teamsArray);
  const [membersList, setMembersList] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>(membersArray);

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

    if (teams.length === 1) {
      setMembers([]);
    }

    setMembersList(filteredMembers);
  };

  const { register, handleSubmit, control, formState: { isSubmitting, errors } } = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      datas: {
        from: project?.DATA_INICIO ? new Date(project.DATA_INICIO) : new Date(),
        to: project?.DATA_FIM ? new Date(project.DATA_FIM) : new Date(new Date().setDate(new Date().getDate() + 1))
      }
    }
  })

  const { field: datas } = useController({
    name: 'datas',
    control
  })

  const fromError = errors.datas?.from;
  const toError = errors.datas?.to;

  const { field: equipes } = useController({
    name: 'equipes',
    control
  })

  const { field: responsaveis } = useController({
    name: 'responsaveis',
    control
  })

  const { field: prioridade } = useController({
    name: 'prioridade',
    control
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const { mutateAsync: updateProjectFn } = useMutation({
    mutationFn: updateProject
  })

  async function handleUpdateProject(projectData: ProjectSchema) {
    console.log(projectData);

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
      
      toast.success('Projeto criado com sucesso!')
      dialogCloseFn();
    } catch {
      toast.error('Erro ao criar o projeto, contate o administrador.')
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
      <form onSubmit={handleSubmit(handleUpdateProject)} className='space-y-8'>
        <div>
          <Label>Nome do projeto</Label>
          <Input
            id="nome"
            type="text"
            placeholder='Digite o nome do projeto'
            {...register('nome')}
            value={project?.NOME}
          />
          {errors.nome && <span className='text-sm text-red-500 font-semibold'>{errors.nome.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Datas</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-60 justify-start text-left font-normal',
                  !range && 'text-muted-foreground'
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {range?.from && range?.to
                  ? `${format(range.from, 'P', {
                      locale: ptBR
                    })} a ${format(range.to, 'P', {
                      locale: ptBR
                    })}`
                  : 'Selecione as datas'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto p-0">
              <Calendar
                mode="range"
                selected={range ? { from: range.from, to: range.to } : undefined}
                onSelect={(range) => {
                  datas.onChange({
                    from: range?.from,
                    to: range?.to
                  });
                  setRange({
                    from: range?.from,
                    to: range?.to
                  });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fromError ? (
            fromError.type === 'invalid_date' 
            ? <span className="text-sm text-red-500 font-semibold">As datas devem ser selecionadas</span>
            : <span className="text-sm text-red-500 font-semibold">{fromError.message}</span>
          ) : (
              toError?.type === 'invalid_date' 
                ? <span className="text-sm text-red-500 font-semibold">Selecione a data final</span>
                : <span className="text-sm text-red-500 font-semibold">{toError?.message}</span>
            )
          }
        </div>

        <div>
          <Label>Descrição</Label>
          <Textarea
            id="descricao"
            placeholder='Descreva o projeto'
            {...register('descricao')}
            value={project?.DESCRICAO}
          />
          {errors.descricao && <span className='text-sm text-red-500 font-semibold'>{errors.descricao.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Equipes</Label>
          <MultiSelect
            options={teamsList.map((subTeamName, index) => ({
              value: subTeamName,
              label: subTeamName,
              key: index
            }))}
            selected={teams}
            onChange={(selectedTeams) => {
              equipes.onChange(selectedTeams);
              setTeams(selectedTeams);
              handleTeamsChange(selectedTeams);
            }}
            className="max-w-[462px]"
            placeholder="Selecione a(s) equipe(s)"
          />
          {errors.equipes && <span className='text-sm text-red-500 font-semibold'>Selecione pelo menos uma equipe</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Responsáveis</Label>
          <MultiSelect
            options={membersList.map((memberName, index) => ({
              value: memberName,
              label: memberName,
              key: index
            }))}
            selected={members}
            onChange={(members) => {
              responsaveis.onChange(members);
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
            {errors.responsaveis && <span className='text-sm text-red-500 font-semibold'>Selecione pelo menos um responsável</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Prioridade</Label>
          <Select
            onValueChange={(prioridadeSelecionada) => {
              prioridade.onChange(prioridadeSelecionada);
            }}
            value={project?.PRIORIDADE}
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
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
          {errors.prioridade && <span className='text-sm text-red-500 font-semibold'>Selecione a prioridade</span>}
        </div>

        <div className="flex justify-center">
          <DialogFooter>
            <Button disabled={isSubmitting} type="submit">Atualizar projeto</Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  );
}
