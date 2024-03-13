import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateMemberRole } from '@/app/api/departments/update-member-role';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
  const handleChangeRole = async (role: string) => {
    try {
      await updateMemberRoleFn({
        role: role,
        chapa: chapa
      });

      toast.success('A função do membro foi atualizada com sucesso!');
    } catch {
      toast.error('Erro ao atualizar a função, contate o administrador.');
    }
  };

  const { mutateAsync: updateMemberRoleFn, isPending } = useMutation({
    mutationFn: updateMemberRole
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
          <SelectItem value="Membro">Membro</SelectItem>
          <SelectItem disabled={team === 'Não alocado'} value="Coordenador">
            Coordenador
          </SelectItem>
          <SelectItem value="Administrador">Administrador</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
