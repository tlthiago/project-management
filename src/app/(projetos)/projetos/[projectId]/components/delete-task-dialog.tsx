import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTask } from '@/app/api/projetos/tarefas/delete-task';
import { restoreTask } from '@/app/api/projetos/tarefas/restore-task';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface deleteTaskDialogProps {
  taskId: string;
}

export function DeleteTaskDialog({ taskId }: deleteTaskDialogProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteTaskFn } = useMutation({
    mutationFn: deleteTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const { mutateAsync: restoreTaskFn } = useMutation({
    mutationFn: restoreTask,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  async function undoDelete(taskId: string) {
    try {
      await restoreTaskFn({
        taskId: taskId
      });

      toast.success('Tarefa restaurada.');
    } catch {
      toast.error('Erro ao restaurar a tarefa, contate o administrador.');
    }
  }

  async function handleSubmit(taskId: string) {
    try {
      await deleteTaskFn({
        taskId: taskId
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir tarefa</DialogTitle>
      </DialogHeader>
      Tem certeza que deseja excluir a tarefa?
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => handleSubmit(taskId)}
          >
            Excluir
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
