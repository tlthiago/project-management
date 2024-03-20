import { api } from '@/lib/axios';

export interface ArchiveProjectParams {
  projectId: string;
  usuAtualizacao: string;
}

export async function archiveProject({
  projectId,
  usuAtualizacao
}: ArchiveProjectParams) {
  const response = await api.put(`/projects/archive/${projectId}`, {
    usuAtualizacao
  });

  return response.data;
}
