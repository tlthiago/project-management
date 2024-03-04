import { api } from '@/lib/axios';

export interface UpdateProjectStatusBody {
  projectId: number;
  status: string;
}

export async function UpdateProjectStatus({
  projectId,
  status
}: UpdateProjectStatusBody) {
  console.log(projectId);
  console.log(status);

  await api.patch(`/projects/${projectId}`, { status });
}
