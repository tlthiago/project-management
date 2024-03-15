import { api } from '@/lib/axios';

export interface UpdateProjectStatusBody {
  projectId: number;
  status: string;
  usuAtualizacao: string;
}

export async function UpdateProjectStatus({
  projectId,
  status,
  usuAtualizacao
}: UpdateProjectStatusBody) {
  await api.put(`/projects/update-status/${projectId}`, {
    status,
    usuAtualizacao
  });
}
