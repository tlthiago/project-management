import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
import {
  getTeamById,
  GetTeamByIdResponse
} from '@/app/api/departments/get-team-by-id';
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

const teamSchema = z.object({
  nome: z.string().min(1, { message: 'O nome da equipe deve ser informado.' }),
  membros: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um membro. ' })
});

interface UpdateTeamFormProps {
  teamId: string;
  open: boolean;
}

export function UpdateTeamForm({ teamId, open }: UpdateTeamFormProps) {
  const { data: session } = useSession();

  const codDepartment: string = session?.user.CODSETOR ?? '';

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', codDepartment],
    queryFn: () => getMembersByDepartment({ codDepartment }),
    enabled: open && !!codDepartment
  });

  const { data: team } = useQuery<GetTeamByIdResponse>({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById({ teamId }),
    enabled: open
  });

  const queryClient = useQueryClient();

  // const membersList: string[] = members.map(member => member.NOME);

  const membersList: string[] = members
    .filter((member) => member.EQUIPE == 'Não alocado')
    .map((member) => member.NOME);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const teamMembers: string[] = team?.MEMBROS.split(', ') || [];

  useEffect(() => {
    setSelectedMembers(teamMembers);
  }, [team]);

  const removed: string[] = [];

  teamMembers.forEach((teamMember) => {
    if (!selectedMembers.includes(teamMember)) {
      members.map((member) => {
        if (member.NOME === teamMember) {
          removed.push(member.CHAPA);
        }
      });
    }
  });

  const added: string[] = [];

  selectedMembers.forEach((selectedMember) => {
    if (!teamMembers.includes(selectedMember)) {
      members.map((member) => {
        if (member.NOME === selectedMember) {
          added.push(member.CHAPA);
        }
      });
    }
  });

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    values: {
      nome: team?.NOME ?? '',
      membros: team?.MEMBROS.split(', ') || []
    }
  });

  const { mutateAsync: updateTeamFn } = useMutation({
    mutationFn: updateTeam,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['members', codDepartment] });
      queryClient.invalidateQueries({ queryKey: ['teams', codDepartment] });
    }
  });

  async function onSubmit(teamData: z.infer<typeof teamSchema>) {
    try {
      await updateTeamFn({
        teamId: teamId,
        teamName: teamData.nome !== team?.NOME ? teamData.nome : undefined,
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
            name="membros"
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
