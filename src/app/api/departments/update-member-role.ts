import { api } from '@/lib/axios';

interface UpdateMemberRoleParams {
  chapa: string;
  role: string;
}

export async function updateMemberRole({ chapa, role }: UpdateMemberRoleParams) {
  await api.put(`/member/${chapa}`, { role });
}