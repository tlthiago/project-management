import { api } from '@/lib/axios';

export interface DeleteTaskParams {
  taskId: string;
  usuAtualizacao: string;
}

export async function deleteTask({ taskId, usuAtualizacao }: DeleteTaskParams) {
  const response = await api.put(`/projects/tasks/delete/${taskId}`, {
    usuAtualizacao
  });

  return response.data;
}
