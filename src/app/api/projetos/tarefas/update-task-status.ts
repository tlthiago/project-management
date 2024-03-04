import { api } from '@/lib/axios';

export interface UpdateTaskStatusBody {
  taskId: number;
  status: string;
}

export async function UpdateTaskStatus({
  taskId,
  status
}: UpdateTaskStatusBody) {
  await api.patch(`/projects/tasks/${taskId}`, { status });
}
