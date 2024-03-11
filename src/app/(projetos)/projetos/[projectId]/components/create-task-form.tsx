'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import { createTask } from '@/app/api/projetos/tarefas/create-task';
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

interface createTaskFormProps {
  projectId: string;
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

export function CreateTaskForm({ projectId, open }: createTaskFormProps) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!open
  });

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department }),
    enabled: !!open
  });

  const membersList: string[] = project?.MEMBROS.split(',') || [];
  const [member, setMember] = useState<string[]>([]);

  const membersChapas: string[] = [];

  member.map((selectedMember) => {
    members.map((member) => {
      if (selectedMember === member.NOME) {
        membersChapas.push(member.CHAPA);
      }
    });
  });

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      nome: '',
      responsaveis: [],
      prioridade: ''
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync: createTaskFn } = useMutation({
    mutationFn: createTask,
    onSuccess() {
      form.reset();
      setMember([]);
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  async function onSubmit(taskData: z.infer<typeof taskSchema>) {
    try {
      await createTaskFn({
        projectId: projectId,
        nome: taskData.nome,
        dataInicio: taskData.datas?.from
          ? format(taskData.datas.from, 'yyyy-MM-dd', { locale: ptBR })
          : undefined,
        dataFim: taskData.datas?.to
          ? format(taskData.datas.to, 'yyyy-MM-dd', { locale: ptBR })
          : undefined,
        descricao: taskData.descricao ?? undefined,
        chapas: membersChapas,
        prioridade: taskData.prioridade,
        usuInclusao: session?.user.CODUSUARIO ?? 'A_MMWEB'
      });

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome da tarefa <span className="text-rose-600">*</span>
                </FormLabel>
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
                          ? `${format(field.value?.from, 'P', {
                              locale: ptBR
                            })} a ${format(field.value?.to, 'P', {
                              locale: ptBR
                            })}`
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
                      member.length === 0 ? 'Selecione os responsáveis' : ''
                    }
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
                Criar tarefa
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
