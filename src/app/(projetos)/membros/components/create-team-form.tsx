import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { createTeam } from '@/app/api/departments/create-team';
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

const teamSchema = z.object({
  teamName: z
    .string()
    .min(1, { message: 'O nome da equipe deve ser informado.' }),
  members: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um membro. ' })
});

export function CreateTeamForm() {
  const { data: session } = useSession();

  const department = session?.user.SETOR ?? '';

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department }),
    enabled: !!department
  });

  const queryClient = useQueryClient();

  const membersList: string[] = members
    .filter((member) => member.EQUIPE == 'Não alocado')
    .map((member) => member.NOME);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const chapas: string[] = [];

  selectedMembers.map((selectedMember) => {
    members.map((member) => {
      if (member.NOME === selectedMember) {
        chapas.push(member.CHAPA);
      }
    });
  });

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: ''
    }
  });

  const { mutateAsync: createTeamFn } = useMutation({
    mutationFn: createTeam,
    onSuccess() {
      setSelectedMembers([]);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['teams', department] });
      queryClient.invalidateQueries({ queryKey: ['members', department] });
    }
  });

  async function onSubmit(teamData: z.infer<typeof teamSchema>) {
    try {
      await createTeamFn({
        teamName: teamData.teamName,
        department: department,
        chapas: chapas,
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
            name="teamName"
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
            name="members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membros</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={membersList.map((memberName, index) => ({
                      value: memberName,
                      label: memberName,
                      key: index
                    }))}
                    selected={selectedMembers}
                    onChange={(members) => {
                      field.onChange(members);
                      setSelectedMembers(members);
                    }}
                    className="w-96"
                    placeholder="Selecione os responsáveis"
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
