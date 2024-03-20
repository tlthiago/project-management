import { api } from '@/lib/axios';

export interface RestoreTaskParams {
  taskId: string;
  usuAtualizacao: string;
}

export async function restoreTask({
  taskId,
  usuAtualizacao
}: RestoreTaskParams) {
  const response = await api.put(`/projects/tasks/restore/${taskId}`, {
    usuAtualizacao
  });

  return response.data;
}
