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
import { useForm } from 'react-hook-form';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '@/app/api/get-profile';
import { toast } from 'sonner';
import { GetTaskByIdResponse, getTaskById } from '@/app/api/projetos/get-task-by-id';
import { updateTask } from '@/app/api/projetos/update-task';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';

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

interface updateTaskFormProps {
  projectId: string;
  taskId: string;
  open: boolean;
}

export function UpdateTaskForm( { projectId, taskId, open }: updateTaskFormProps ) {
  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: open
  })
  
  const { data: task } = useQuery<GetTaskByIdResponse>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ taskId }),
    enabled: open
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const queryClient = useQueryClient();

  const [range, setRange] = useState<DateRange | undefined>();
  const membersList: string[] = project?.RESPONSAVEIS.split(', ') || [];
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    setMembers(task?.RESPONSAVEIS.split(', ') || [])
  }, [task])

  const dataInicio: string = new Date().toString();
  const dataFim: string = new Date(new Date().setDate(new Date().getDate() + 1)).toString();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    values: {
      nome: task?.NOME ?? '',
      datas: {
        from: task?.DATA_INICIO ? new Date(task?.DATA_INICIO) : new Date(dataInicio),
        to: task?.DATA_FIM ? new Date(task?.DATA_FIM) : new Date(dataFim)
      },
      descricao: task?.DESCRICAO ?? '',
      responsaveis: task?.RESPONSAVEIS.split(', ') || [],
      prioridade: task?.PRIORIDADE || ''
    }
  })

  const { mutateAsync: updateTaskFn } = useMutation({
    mutationFn: updateTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  })

  async function onSubmit(taskData: z.infer<typeof taskSchema>) {
    try {
      await updateTaskFn({
        taskId: taskId,
        nome: taskData.nome,
        dataInicio: format(taskData.datas.from, 'yyyy-MM-dd', { locale: ptBR }),
        dataFim: format(taskData.datas.to, 'yyyy-MM-dd', { locale: ptBR }),
        descricao: taskData.descricao,
        responsaveis: taskData.responsaveis,
        prioridade: taskData.prioridade,
        usuInclusao: profile ? profile?.codUsuario : 'TL_THIAGO'
      })
      
      toast.success('Tarefa atualizada com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao atualizar a tarefa, contate o administrador.');
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
                  <Input placeholder="Digite o nome da tarefa" {...field} />
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
                  <Textarea placeholder='Descreva a tarefa' {...field} />
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
                    placeholder="Selecione os responsáveis"
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
              <Button disabled={form.formState.isSubmitting} type="submit">Atualizar tarefa</Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
