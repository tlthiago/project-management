import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMemberRole } from '@/app/api/departments/update-member-role';

export interface UpdateMemberRoleProps {
  chapa: string;
  role: string;
}

export default function UpdateMemberRole({ chapa, role }: UpdateMemberRoleProps) {
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
  }

  const { mutateAsync: updateMemberRoleFn, isPending } = useMutation({
    mutationFn: updateMemberRole
  });

  return (
    <div>
      <Select disabled={isPending} defaultValue={role} onValueChange={handleChangeRole}>
        <SelectTrigger>
          <SelectValue placeholder={role} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Membro">Membro</SelectItem>
          <SelectItem value="Administrador">Administrador</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}