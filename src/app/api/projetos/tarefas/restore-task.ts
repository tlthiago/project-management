import { api } from '@/lib/axios';

export interface RestoreTaskParams {
  taskId: string;
}

export async function restoreTask({ taskId }: RestoreTaskParams) {
  const response = await api.put(`/projects/tasks/restore/${taskId}`);

  return response.data;
}
