import { api } from '@/lib/axios';

interface UpdateMemberRoleParams {
  chapa: string;
  role: string;
  usuAtualizacao: string;
}

export async function updateMemberRole({
  chapa,
  role,
  usuAtualizacao
}: UpdateMemberRoleParams) {
  await api.put(`/member/${chapa}`, { role, usuAtualizacao });
}
