import { api } from '@/lib/axios';

export interface UpdateTaskStatusBody {
  taskId: number;
  projectId: number;
  status: string;
}

export async function UpdateTaskStatus({
  taskId,
  projectId,
  status
}: UpdateTaskStatusBody) {
  await api.patch(`/projects/tasks/${taskId}`, { projectId, status });
}