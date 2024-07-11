import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { createTeam } from '@/app/api/departments/create-team';
import {
  getDepartments,
  GetDepartmentsResponse
} from '@/app/api/departments/get-departments';
import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
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

interface Department {
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
}

interface CreateTeamFormProps {
  open: boolean;
}

const teamSchema = z.object({
  nome: z.string().min(1, { message: 'O nome da equipe deve ser informado.' }),
  departamento: z.string().min(1, { message: 'Selecione um departamento.' }),
  membros: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um membro. ' })
});

export function CreateTeamForm({ open }: CreateTeamFormProps) {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const department = session?.user.SETOR ?? '';
  const role = session?.user.FUNCAO ?? '';

  const { data: departments = [] } = useQuery<GetDepartmentsResponse[]>({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
    enabled: !!open && !!role && role === 'Administrador'
  });

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      nome: '',
      departamento: codDepartment,
      membros: []
    }
  });

  const departmentValue = form.watch('departamento');

  useEffect(() => {
    if (departmentValue) {
      form.setValue('membros', []);
    }
  }, [departmentValue, form]);

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members-by-department', departmentValue],
    queryFn: () => getMembersByDepartment({ codDepartment: departmentValue }),
    enabled: !!open && !!departmentValue
  });

  const membersList = members
    .filter((member) => member.EQUIPE == 'Não alocado')
    .map((member) => ({
      CHAPA: member.CHAPA,
      NOME: member.NOME
    }));

  const queryClient = useQueryClient();

  const { mutateAsync: createTeamFn } = useMutation({
    mutationFn: createTeam,
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

    try {
      await createTeamFn({
        nome: teamData.nome,
        codDepartamento: teamData.departamento,
        membros: teamData.membros,
        usuInclusao: session?.user.CODUSUARIO ?? 'A_MMWEB'
      });

      toast.success('Equipe criada com sucesso!');
      dialogCloseFn();
    } catch {
      toast.error('Erro ao criar a equipe, contate o administrador.');
      dialogCloseFn();
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar equipe</DialogTitle>
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
                <FormLabel>
                  Nome <span className="text-rose-600">*</span>
                </FormLabel>
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
                        <SelectItem value={codDepartment}>
                          {department}
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
              <Button disabled={form.formState.isSubmitting} type="submit">
                Criar equipe
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
