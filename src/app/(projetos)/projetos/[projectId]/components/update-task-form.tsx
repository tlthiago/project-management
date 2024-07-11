'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import {
  getTaskById,
  GetTaskByIdResponse
} from '@/app/api/projetos/tarefas/get-task-by-id';
import { updateTask } from '@/app/api/projetos/tarefas/update-task';
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

interface Member {
  CHAPA: string;
  NOME: string;
}

interface updateTaskFormProps {
  taskId: number;
  open: boolean;
}

export const taskSchema = z
  .object({
    nome: z
      .string()
      .min(1, { message: 'O nome da tarefa deve ser informado.' }),
    datas: z
      .object({
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional()
      })
      .optional(),
    descricao: z.string().optional(),
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

export function UpdateTaskForm({ taskId, open }: updateTaskFormProps) {
  const { data: session } = useSession();

  const pathname = usePathname();
  const segments = pathname.split('/');
  const projectId = parseInt(segments[segments.length - 1]);

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: open
  });

  const { data: task } = useQuery<GetTaskByIdResponse>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ taskId }),
    enabled: open
  });

  const members =
    project?.EQUIPES.flatMap((team) =>
      team.MEMBROS.flatMap((member: Member) => ({
        CHAPA: member.CHAPA,
        NOME: member.NOME
      }))
    ) || [];

  const currentMembers =
    task?.RESPONSAVEIS.flatMap((member) => member.CHAPA) || [];

  const removed: { chapas: string[] } = { chapas: [] };

  const added: { chapas: string[] } = { chapas: [] };

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    values: {
      nome: task?.NOME ?? '',
      datas:
        task?.DATA_INICIO && task?.DATA_FIM
          ? {
              from: new Date(task?.DATA_INICIO),
              to: new Date(task?.DATA_FIM)
            }
          : undefined,
      descricao: task?.DESCRICAO ?? undefined,
      responsaveis: currentMembers,
      prioridade: task?.PRIORIDADE || ''
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync: updateTaskFn } = useMutation({
    mutationFn: updateTask,
    onSuccess() {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      }, 1000);
    }
  });

  async function onSubmit(taskData: z.infer<typeof taskSchema>) {
    // console.log(taskData);

    currentMembers.forEach((member) => {
      if (!form.getValues('responsaveis').includes(member)) {
        removed.chapas.push(member);
      }
    });

    form.getValues('responsaveis').forEach((member) => {
      if (!currentMembers.includes(member)) {
        added.chapas.push(member);
      }
    });

    const dataInicio: string | null | undefined =
      taskData.datas?.from !== undefined && task?.DATA_INICIO === null
        ? format(taskData.datas.from, 'yyyy-MM-dd', {
            locale: ptBR
          })
        : taskData.datas?.from !== undefined &&
            task?.DATA_INICIO &&
            format(taskData.datas.from, 'yyyy-MM-dd', { locale: ptBR }) !==
              task?.DATA_INICIO.split('T', 1)[0]
          ? format(taskData.datas.from, 'yyyy-MM-dd', {
              locale: ptBR
            })
          : taskData.datas?.from !== undefined &&
              task?.DATA_INICIO &&
              format(taskData.datas.from, 'yyyy-MM-dd', { locale: ptBR }) ===
                task?.DATA_INICIO.split('T', 1)[0]
            ? undefined
            : null;

    const dataFim: string | null | undefined =
      taskData.datas?.to !== undefined && task?.DATA_FIM === null
        ? format(taskData.datas.to, 'yyyy-MM-dd', {
            locale: ptBR
          })
        : taskData.datas?.to !== undefined &&
            task?.DATA_FIM &&
            format(taskData.datas.to, 'yyyy-MM-dd', { locale: ptBR }) !==
              task?.DATA_FIM.split('T', 1)[0]
          ? format(taskData.datas.to, 'yyyy-MM-dd', {
              locale: ptBR
            })
          : taskData.datas?.to !== undefined &&
              task?.DATA_FIM &&
              format(taskData.datas.to, 'yyyy-MM-dd', { locale: ptBR }) ===
                task?.DATA_FIM.split('T', 1)[0]
            ? undefined
            : null;

    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const updateDelayedStatus: string | undefined =
      task?.ATRASADO === 'S' && dataFim && dataFim >= todayDate
        ? 'N'
        : task?.ATRASADO === 'N' && dataFim && dataFim < todayDate
          ? 'S'
          : undefined;

    try {
      await updateTaskFn({
        taskId: taskId,
        nome: taskData.nome !== task?.NOME ? taskData.nome : undefined,
        dataInicio: dataInicio,
        dataFim: dataFim,
        descricao:
          taskData.descricao !== task?.DESCRICAO
            ? taskData.descricao
            : undefined,
        prioridade:
          taskData.prioridade !== task?.PRIORIDADE
            ? taskData.prioridade
            : undefined,
        added: added.chapas.length > 0 ? added : undefined,
        removed: removed.chapas.length > 0 ? removed : undefined,
        usuInclusao:
          added.chapas.length > 0 ? session?.user.CODUSUARIO : undefined,
        usuAtualizacao: session?.user.CODUSUARIO
          ? session?.user.CODUSUARIO
          : 'MM_WEB',
        atrasado: updateDelayedStatus ?? updateDelayedStatus
      });

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
        <DialogTitle>Atualizar tarefa</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo com as informações da tarefa
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Textarea placeholder="Descreva a tarefa" {...field} />
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
                    options={members.map((member) => ({
                      value: member.CHAPA,
                      label: member.NOME,
                      key: member.CHAPA
                    }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder={
                      field.value.length === 0
                        ? 'Selecione os responsáveis'
                        : ''
                    }
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
                Atualizar tarefa
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
