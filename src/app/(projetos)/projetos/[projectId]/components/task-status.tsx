import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Circle, Timer } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { UpdateTaskStatus } from '@/app/api/projetos/tarefas/update-task-status';
import Status from '@/components/status';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { queryClient } from '@/lib/react-query';

interface TaskStatusProps {
  taskId: number;
  status: string;
}

export default function TaskStatus({ taskId, status }: TaskStatusProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleStatusChange = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateTaskStatusFn({
          taskId: taskId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
      case 'Em andamento':
        await UpdateTaskStatusFn({
          taskId: taskId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
      case 'Finalizado':
        await UpdateTaskStatusFn({
          taskId: taskId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
        });
        break;
    }
  };

  const { mutateAsync: UpdateTaskStatusFn, isPending } = useMutation({
    mutationFn: UpdateTaskStatus,
    onSuccess() {
      const segments = pathname.split('/');
      const projectId = parseInt(segments[segments.length - 1]);

      toast.success('Status atualizado.');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  });

  return (
    <Select onValueChange={handleStatusChange} defaultValue={status}>
      <SelectTrigger disabled={isPending}>
        <SelectValue placeholder={<Status status={status} />} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pendente">
          <div className="flex items-center">
            <Circle className="mr-2 h-4 w-4 " />
            <span>Pendente</span>
          </div>
        </SelectItem>
        <SelectItem value="Em andamento">
          <div className="flex items-center">
            <Timer className="mr-2 h-4 w-4 " />
            <span>Em andamento</span>
          </div>
        </SelectItem>
        <SelectItem value="Finalizado">
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 " />
            <span>Finalizado</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
