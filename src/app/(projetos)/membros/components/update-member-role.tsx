import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { updateMemberRole } from '@/app/api/departments/update-member-role';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { queryClient } from '@/lib/react-query';

export interface UpdateMemberRoleProps {
  chapa: string;
  team: string;
  role: string;
}

export default function UpdateMemberRole({
  chapa,
  team,
  role
}: UpdateMemberRoleProps) {
  const { data: session } = useSession();
  const department = session?.user.CODSETOR ?? '';
  const userRole = session?.user.FUNCAO ?? '';

  const handleChangeRole = async (role: string) => {
    try {
      await updateMemberRoleFn({
        role: role,
        chapa: chapa,
        usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
      });

      toast.success('A função do membro foi atualizada com sucesso!');
    } catch {
      toast.error('Erro ao atualizar a função, contate o administrador.');
    }
  };

  const { mutateAsync: updateMemberRoleFn, isPending } = useMutation({
    mutationFn: updateMemberRole,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', department] });
    }
  });

  return (
    <div>
      <Select
        disabled={isPending}
        defaultValue={role}
        onValueChange={handleChangeRole}
      >
        <SelectTrigger>
          <SelectValue placeholder={role} />
        </SelectTrigger>
        <SelectContent>
          {userRole === 'Administrador' && (
            <>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Gerente">Gerente</SelectItem>
            </>
          )}
          <SelectItem disabled={team === 'Não alocado'} value="Coordenador">
            Coordenador
          </SelectItem>
          <SelectItem value="Membro">Membro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
