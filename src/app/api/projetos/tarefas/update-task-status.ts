import { api } from '@/lib/axios';

export interface UpdateTaskStatusBody {
  taskId: number;
  status: string;
  usuAtualizacao: string;
}

export async function UpdateTaskStatus({
  taskId,
  status,
  usuAtualizacao
}: UpdateTaskStatusBody) {
  await api.put(`/projects/tasks/update-status/${taskId}`, {
    status,
    usuAtualizacao
  });
}
