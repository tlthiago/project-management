import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { deleteTask } from '@/app/api/projetos/tarefas/delete-task';
import { restoreTask } from '@/app/api/projetos/tarefas/restore-task';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface deleteTaskDialogProps {
  taskId: string;
}

export function DeleteTaskDialog({ taskId }: deleteTaskDialogProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const pathname = usePathname();

  const { mutateAsync: deleteTaskFn } = useMutation({
    mutationFn: deleteTask,
    onSuccess() {
      const segments = pathname.split('/');
      const projectId = parseInt(segments[segments.length - 1]);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  });

  const { mutateAsync: restoreTaskFn } = useMutation({
    mutationFn: restoreTask,
    onSuccess() {
      const segments = pathname.split('/');
      const projectId = parseInt(segments[segments.length - 1]);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  });

  async function undoDelete(taskId: string) {
    try {
      await restoreTaskFn({
        taskId: taskId,
        usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
      });

      toast.success('Tarefa restaurada.');
    } catch {
      toast.error('Erro ao restaurar a tarefa, contate o administrador.');
    }
  }

  async function handleSubmit(taskId: string) {
    try {
      await deleteTaskFn({
        taskId: taskId,
        usuAtualizacao: session?.user.CODUSUARIO
          ? session?.user.CODUSUARIO
          : 'MM_WEB'
      });

      toast.success('A tarefa foi excluída!', {
        action: {
          label: 'Desfazer',
          onClick: () => undoDelete(taskId)
        }
      });
    } catch {
      toast.error('Erro ao excluir a tarefa, contate o administrador.');
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir a tarefa?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction type="submit" onClick={() => handleSubmit(taskId)}>
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
