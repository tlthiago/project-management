import { api } from '@/lib/axios';

export interface DeleteProjectParams {
  projectId: string;
  usuAtualizacao: string;
}

export async function deleteProject({
  projectId,
  usuAtualizacao
}: DeleteProjectParams) {
  const response = await api.put(`/projects/delete/${projectId}`, {
    usuAtualizacao
  });

  return response.data;
}
