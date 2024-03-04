import { api } from '@/lib/axios';

export interface DeleteTaskParams {
  taskId: string;
}

export async function deleteTask({
  taskId
}: DeleteTaskParams) {
  const response = await api.delete(`/projects/tasks/${taskId}`);

  return response.data
}