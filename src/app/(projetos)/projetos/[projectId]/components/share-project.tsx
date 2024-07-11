'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  getDepartments,
  GetDepartmentsResponse
} from '@/app/api/departments/get-departments';
import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import { insertNewMembers } from '@/app/api/projetos/insert-new-members';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: Member[];
}

interface Department {
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
}

const formSchema = z.object({
  departamento: z.string().min(1, { message: 'Selecione um departamento.' }),
  equipe: z.string().min(1, { message: 'Selecione um equipe.' }),
  membros: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um membro' })
});

interface ShareProjectProps {
  open: boolean;
  projectId: number;
  currentMembers: Member[];
  onClose: () => void;
}

export function ShareProject({
  open,
  projectId,
  currentMembers,
  onClose
}: ShareProjectProps) {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const user = session?.user.CODUSUARIO ?? '';

  const { data: departments = [] } = useQuery<GetDepartmentsResponse[]>({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
    enabled: !!open
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departamento: '',
      equipe: '',
      membros: []
    }
  });

  const departmentSelected = form.watch('departamento');

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams-by-department', departmentSelected],
    queryFn: () => getTeamsByDepartment({ codDepartment: departmentSelected }),
    enabled: !!open && !!departmentSelected
  });

  const teamsList: Team[] = teams.map((team) => ({
    ID: team.ID,
    NOME: team.NOME,
    MEMBROS: team.MEMBROS
  }));

  const teamSelected = form.watch('equipe');

  const filteredMembers = teamsList
    .filter((team) => teamSelected.includes(team.ID.toString()))
    .flatMap((team) => team.MEMBROS)
    .filter(
      (member) =>
        !currentMembers.some(
          (currentMember) => currentMember.CHAPA === member.CHAPA
        )
    );

  useEffect(() => {
    form.resetField('equipe');
    form.setValue('membros', []);
  }, [departmentSelected, form]);

  useEffect(() => {
    form.setValue('membros', []);
  }, [teamSelected, form]);

  const queryClient = useQueryClient();

  const { mutateAsync: insertNewMembersFn } = useMutation({
    mutationFn: insertNewMembers,
    onSuccess() {
      form.reset();
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-department', codDepartment]
        });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-team', chapa]
        });
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      }, 1000);
    }
  });

  async function onSubmit(formShareData: z.infer<typeof formSchema>) {
    // console.log(formShareData);

    try {
      await insertNewMembersFn({
        projetoId: projectId,
        equipe: parseInt(formShareData.equipe),
        membros: formShareData.membros,
        usuInclusao: user ?? 'A_MMWEB'
      });

      toast.success('O membro foi adicionado com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao adicionar o membro, contate o administrador.');
      onClose();
    }
  }

  return (
    <PopoverContent align="start" side="left" className="w-96 space-y-2">
      <span className="font-semibold">Convidar para o projeto</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Departamento <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department: Department) => (
                        <SelectItem
                          key={department.CODDEPARTAMENTO}
                          value={department.CODDEPARTAMENTO}
                        >
                          {department.DEPARTAMENTO}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Equipe <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!departmentSelected}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma equipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamsList.map((team: Team) => (
                        <SelectItem key={team.ID} value={team.ID.toString()}>
                          {team.NOME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="membros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Membros <span className="text-rose-600">*</span>
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
                    placeholder="Selecione os membros"
                    disabled={!departmentSelected || !teamSelected}
                    modalPopover={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Convidar
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </PopoverContent>
  );
}
