import { api } from '@/lib/axios';

export interface DeleteProjectParams {
  projectId: string;
}

export async function deleteProject({
  projectId
}: DeleteProjectParams) {
  const response = await api.delete(`/projects/${projectId}`);

  return response.data
}