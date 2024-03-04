import { api } from '@/lib/axios';

export interface ArchiveProjectParams {
  projectId: string;
}

export async function archiveProject({
  projectId
}: ArchiveProjectParams) {
  const response = await api.put(`/projects/archive/${projectId}`);

  return response.data
}