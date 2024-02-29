import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  dialogCloseFn,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MultiSelect } from "@/components/ui/multi-select";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetMembersByDepartmentResponse, getMembersByDepartment } from "@/app/api/departments/get-members-by-department";
import { updateTeam } from "@/app/api/departments/update-team";
import { toast } from "sonner";
import { GetTeamByIdResponse, getTeamById } from '@/app/api/departments/get-team-by-id';
import { useSession } from "next-auth/react";

const teamSchema = z.object({
  nome: z.string().min(1, { message: 'O nome da equipe deve ser informado.' }),
  membros: z.array(z.string()).min(1, { message: 'Selecione pelo menos um membro. '})
})

interface UpdateTeamFormProps {
  teamId: string;
  open: boolean;
}

export function UpdateTeamForm({ teamId, open }: UpdateTeamFormProps) {
  const { data: session } = useSession();

  const department: string = session?.user.SETOR ?? '';

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department }),
    enabled: open
  });

  const { data: team } = useQuery<GetTeamByIdResponse>({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById({ teamId }),
    enabled: open
  });

  const queryClient = useQueryClient();

  const membersList: string[] = members.map(member => member.NOME);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const teamMembers: string[] = team?.MEMBROS.split(', ') || [];
  
  useEffect(() => {
    setSelectedMembers(teamMembers)
  }, [team]);

  const removed: { chapa: string, memberName: string }[] = [];

  teamMembers.forEach(teamMember => {
    if (!selectedMembers.includes(teamMember)) {
      members.map(member => {
        if (member.NOME === teamMember) {
          removed.push({
            chapa: member.CHAPA,
            memberName: teamMember
          })
        }
      })
    }
  });

  const added: { chapa: string, memberName: string }[] = [];

  selectedMembers.forEach(selectedMember => {
    if (!teamMembers.includes(selectedMember)) {
      members.map(member => {
        if (member.NOME === selectedMember) {
          added.push({
            chapa: member.CHAPA,
            memberName: selectedMember
          })
        }
      })
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
      queryClient.invalidateQueries({ queryKey: ['members', department] });
      queryClient.invalidateQueries({ queryKey: ['teams', department] });
    }
  });
  
  async function onSubmit(teamData: z.infer<typeof teamSchema>) {
    try {
      await updateTeamFn({
        teamId: teamId,
        teamName: teamData.nome,
        department: department,
        removed: removed && removed.length > 0 ? removed : undefined,
        added: added && added.length > 0 ? added : undefined,
        usuInclusao: session?.user.CODUSUARIO ?? 'A_MMWEB'
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
        <DialogDescription>Preencha os campos abaixo com as informações da equipe</DialogDescription>
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
            <Button disabled={(
              form.formState.isSubmitting,
              !form.formState.isDirty
            )} type="submit">Atualizar equipe</Button>
          </DialogFooter>
        </div>

        </form>
      </Form>
    </DialogContent>
  )
}