import { api } from '@/lib/axios';

export interface UnarchiveProjectParams {
  projectId: string;
}

export async function unarchiveProject({
  projectId
}: UnarchiveProjectParams) {
  const response = await api.put(`/projects/unarchive/${projectId}`);

  return response.data
}