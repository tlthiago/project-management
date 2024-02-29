import { api } from '@/lib/axios';

export interface UpdateProjectStatusBody {
  id: number;
  status: string;
}

export async function UpdateProjectStatus({
  id,
  status
}: UpdateProjectStatusBody) {
  console.log(id);

  await api.patch(`/projects/${id}`, { status });
}