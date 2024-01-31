'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { departments } from '@/app/api/data/data';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
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
import { createProject } from '@/app/api/projetos/create-project';

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
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
  }),
  descricao: z.string().min(1, { message: 'Descreva o projeto.' }),
  equipes: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos uma equipe.' }),
  responsaveis: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um responsável.' }),
  status: z.string(),
  prioridade: z.string().min(1, { message: 'Selecione a prioridade.' })
});

type ProjectSchema = z.infer<typeof projectSchema>;

export function CreateProjectForm() {
  const [range, setRange] = useState<DateRange | undefined>();
  
  const [teams, setTeams] = useState<string[]>([]);
  const [membersList, setMembersList] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);

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

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema)
  });

  // const { mutateAsync: createProjectFn } = useMutation({
  //   mutationFn: createProject
  // })

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    // try {
    //   await createProjectFn({
        
    //   })
    // } catch {

    // }
    console.log(values);
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
                <FormLabel>Nome do projeto</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Digite o nome do projeto"
                  />
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
                        onSelect={(range) => {
                          field.onChange({
                            from: range?.from,
                            to: range?.to
                          });
                          setRange({
                            dataInicio: range?.from,
                            dataFim: range?.to
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
                  <div>
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
                  </div>
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
                    defaultValue={field.value}
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
              <Button type="submit">Criar projeto</Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
