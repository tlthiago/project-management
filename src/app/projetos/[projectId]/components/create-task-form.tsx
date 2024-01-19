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

import { departments } from '@/app/projetos/data/data';
import { taskSchema } from '@/app/projetos/data/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DialogContent,
  DialogDescription,
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

interface TaskFormProps {
  projectId: string;
  projectTeams: string[];
}

export function CreateTaskForm({ projectId, projectTeams }: TaskFormProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  const [membersList, setMembersList] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);

  const teamsList: string[] = projectTeams;

  const updateMembersList = (newMembers: string[]) => {
    setMembersList((prevMembersList) => [...prevMembersList, ...newMembers]);
  };

  useEffect(() => {
    const filteredMembers: string[] = departments.flatMap(
      (department: Department) =>
        department.teams?.flatMap(
          (team: Team) =>
            team.subTeams
              ?.filter((subTeam: SubTeam) =>
                teamsList.includes(subTeam.name || '')
              )
              .flatMap(
                (subTeam: SubTeam) =>
                  subTeam.members?.map((member: Member) => member.name || '') ||
                  []
              ) || []
        ) || []
    );

    updateMembersList(filteredMembers);
    setMembersList(filteredMembers);
  }, [teamsList]);

  let contador = 0;

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: contador.toString(),
      projectId: projectId,
      name: '',
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1))
      },
      description: '',
      members: [],
      status: 'todo',
      priority: ''
    }
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    contador = contador + 1;
    console.log(values);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da tarefa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Digite o nome da tarefa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Datas</FormLabel>
                <FormControl>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
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
          <FormItem>
            <FormLabel>Equipes</FormLabel>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                disabled
              >
                <div className="flex flex-wrap items-center gap-1">
                  {teamsList.map((item) => (
                    <Badge variant="outline" key={item} className="mb-1 mr-1">
                      {item}
                      <span className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  ))}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsáveis</FormLabel>
                <FormControl>
                  <div>
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowDown />
                          </div>
                          <span>Baixa</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowRight />
                          </div>
                          <span>Média</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <ArrowUp />
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
            <Button type="submit">Criar tarefa</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
