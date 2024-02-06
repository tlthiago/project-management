'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  ChevronsUpDown,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useController, useForm } from 'react-hook-form';
import * as z from 'zod';

import { departments } from '@/app/api/data/data';
import { Badge } from '@/components/ui/badge';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/app/api/projetos/create-task';
import { getProfile } from '@/app/api/get-profile';
import { toast } from 'sonner';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';

interface createTaskFormProps {
  projectId?: string
}

export const taskSchema = z.object({
  nome: z.string().min(1, { message: 'O nome da tarefa deve ser informado.' }),
  datas: z.object({
      from: z.coerce.date(),
      to: z.coerce.date()
    }),
  descricao: z.string().min(1, { message: 'Descreva a tarefa.' }),
  responsaveis: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um responsável.' }),
  prioridade: z.string().min(1, { message: 'Selecione a prioridade.' })
});

export type TaskSchema = z.infer<typeof taskSchema>;

export function CreateTaskForm( { projectId }: createTaskFormProps ) {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  })

  const queryClient = useQueryClient();

  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });

  const membersList: string[] = project?.RESPONSAVEIS.split(', ') || [];
  const [members, setMembers] = useState<string[]>([]);

  const { register, handleSubmit, control, formState: { isSubmitting, errors } } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      datas: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1))
      }
    }
  })

  const { field: datas } = useController({
    name: 'datas',
    control
  })

  const fromError = errors.datas?.from;
  const toError = errors.datas?.to;

  const { field: responsaveis } = useController({
    name: 'responsaveis',
    control
  })

  const { field: prioridade } = useController({
    name: 'prioridade',
    control
  })

  const { mutateAsync: createTaskFn } = useMutation({
    mutationFn: createTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  })

  async function handleCreateTask(taskData: TaskSchema) {
    try {
      await createTaskFn({
        projectId: projectId,
        nome: taskData.nome,
        dataInicio: format(taskData.datas.from, 'yyyy-MM-dd', { locale: ptBR }),
        dataFim: format(taskData.datas.to, 'yyyy-MM-dd', { locale: ptBR }),
        descricao: taskData.descricao,
        responsaveis: taskData.responsaveis,
        prioridade: taskData.prioridade,
        usuInclusao: profile ? profile?.codUsuario : 'TL_THIAGO'
      })
      
      toast.success('Tarefa criada com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao criar a tarefa, contate o administrador.');
      dialogCloseFn();
    }
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Criar tarefa</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo com as informações da tarefa
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleCreateTask)} className='space-y-8'>
        <div>
          <Label>Nome da tarefa</Label>
          <Input
            id="nome"
            type="text"
            placeholder='Digite o nome da tarefa'
            {...register('nome')}
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
            placeholder='Descreva a tarefa'
            {...register('descricao')}
          />
          {errors.descricao && <span className='text-sm text-red-500 font-semibold'>{errors.descricao.message}</span>}
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
            onChange={(membersSelected) => {
              responsaveis.onChange(membersSelected);
              setMembers(membersSelected);
            }}
            className="w-96"
            placeholder="Selecione os responsáveis"
          />
          {errors.responsaveis && <span className='text-sm text-red-500 font-semibold'>Selecione pelo menos um responsável</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Prioridade</Label>
          <Select
            onValueChange={(prioridadeSelecionada) => {
              prioridade.onChange(prioridadeSelecionada);
            }}
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
            <Button disabled={isSubmitting} type="submit">Criar tarefa</Button>
          </DialogFooter>
        </div>
      </form>
      
    </DialogContent>
  );
}
