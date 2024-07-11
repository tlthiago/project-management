import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Circle, Timer } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { UpdateProjectStatus } from '@/app/api/projetos/update-project-status';
import Status from '@/components/status';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { queryClient } from '@/lib/react-query';

interface ProjectStatusProps {
  projectId: number;
  status: string;
}

export default function ProjectStatus({
  projectId,
  status
}: ProjectStatusProps) {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

  const handleStatusChange = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
      case 'Em andamento':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
      case 'Finalizado':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
    }
  };

  const { mutateAsync: UpdateProjectStatusFn, isPending } = useMutation({
    mutationFn: UpdateProjectStatus,
    onSuccess() {
      toast.success('Status atualizado.');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-department', codDepartment]
        });
        queryClient.invalidateQueries({
          queryKey: ['projects-by-team', chapa]
        });
        queryClient.invalidateQueries({ queryKey: ['member-projects', chapa] });
      }, 1000);
    }
  });

  const disableValidation =
    isPending || (role === 'Membro' && status === 'Finalizado');

  return (
    <>
      <Select onValueChange={handleStatusChange} defaultValue={status}>
        <SelectTrigger disabled={disableValidation}>
          <SelectValue placeholder={<Status status={status} />} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pendente">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 " />
              <span>Pendente</span>
            </div>
          </SelectItem>
          <SelectItem value="Em andamento">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 " />
              <span>Em andamento</span>
            </div>
          </SelectItem>
          <SelectItem value="Finalizado">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 " />
              <span>Finalizado</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
