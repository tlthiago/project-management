import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getDepartments,
  GetDepartmentsResponse
} from '@/app/api/departments/get-departments';
import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
import { updateTeam } from '@/app/api/departments/update-team';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface UpdateTeamFormProps<TData> {
  row: Row<TData>;
  open: boolean;
}

interface Department {
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
}

interface Member {
  CHAPA: string;
  NOME: string;
}

const teamSchema = z.object({
  nome: z.string().min(1, { message: 'O nome da equipe deve ser informado.' }),
  departamento: z.string().min(1, { message: 'Selecione um departamento.' }),
  membros: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um membro. ' })
});

export function UpdateTeamForm<TData>({
  row,
  open
}: UpdateTeamFormProps<TData>) {
  const { data: session } = useSession();
  const role = session?.user.FUNCAO ?? '';

  const { data: departments = [] } = useQuery<GetDepartmentsResponse[]>({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
    enabled: !!open && !!role && role === 'Administrador'
  });

  const rowMembers: Member[] = row.getValue('Membros');
  const currentMembers = rowMembers.flatMap((member: Member) => member.CHAPA);

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    values: {
      nome: row.getValue('Nome'),
      departamento: row.getValue('codDepartamento'),
      membros: currentMembers
    }
  });

  const departmentValue = form.watch('departamento');

  useEffect(() => {
    if (departmentValue !== row.getValue('codDepartamento')) {
      form.setValue('membros', []);
    }
  }, [departmentValue, form, row]);

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members-by-department', departmentValue],
    queryFn: () => getMembersByDepartment({ codDepartment: departmentValue }),
    enabled: !!open && !!departmentValue
  });

  const membersList = members
    .filter(
      (member) =>
        member.EQUIPE === 'Não alocado' || currentMembers.includes(member.CHAPA)
    )
    .map((member) => ({
      CHAPA: member.CHAPA,
      NOME: member.NOME
    }));

  const queryClient = useQueryClient();

  const { mutateAsync: updateTeamFn } = useMutation({
    mutationFn: updateTeam,
    onSuccess() {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({
        queryKey: ['teams-by-department', departmentValue]
      });
      queryClient.invalidateQueries({
        queryKey: ['members-by-department', departmentValue]
      });
    }
  });

  async function onSubmit(teamData: z.infer<typeof teamSchema>) {
    // console.log(teamData);

    const removed = currentMembers.filter(
      (member) => !teamData.membros.includes(member)
    );
    const added = teamData.membros.filter(
      (member) => !currentMembers.includes(member)
    );

    try {
      await updateTeamFn({
        teamId: row.getValue('ID'),
        teamName:
          teamData.nome !== row.getValue('Nome') ? teamData.nome : undefined,
        removed: removed && removed.length > 0 ? removed : undefined,
        added: added && added.length > 0 ? added : undefined,
        usuInclusao: session?.user.CODUSUARIO ?? 'A_MMWEB',
        usuAtualizacao: session?.user.CODUSUARIO ?? 'A_MMWEB'
      });

      toast.success('Equipe atualizada com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao atualizar a equipe, contate o administrador.');
      dialogCloseFn();
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Atualizar equipe</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo com as informações da equipe
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
                  <Input placeholder="Digite o nome da equipe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    disabled={role !== 'Administrador'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {role === 'Administrador' ? (
                        <>
                          {departments.map((department: Department) => (
                            <SelectItem
                              key={department.CODDEPARTAMENTO}
                              value={department.CODDEPARTAMENTO}
                            >
                              {department.DEPARTAMENTO}
                            </SelectItem>
                          ))}
                        </>
                      ) : (
                        <SelectItem value={row.getValue('codDepartamento')}>
                          {row.getValue('Departamento')}
                        </SelectItem>
                      )}
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
                    options={membersList.map((member) => ({
                      value: member.CHAPA,
                      label: member.NOME,
                      key: member.CHAPA
                    }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Selecione os membros"
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
              <Button
                disabled={
                  (form.formState.isSubmitting, !form.formState.isDirty)
                }
                type="submit"
              >
                Atualizar equipe
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
