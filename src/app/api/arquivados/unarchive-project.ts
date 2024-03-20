import { api } from '@/lib/axios';

export interface UnarchiveProjectParams {
  projectId: string;
  usuAtualizacao: string;
}

export async function unarchiveProject({
  projectId,
  usuAtualizacao
}: UnarchiveProjectParams) {
  const response = await api.put(`/projects/unarchive/${projectId}`, {
    usuAtualizacao
  });

  return response.data;
}
