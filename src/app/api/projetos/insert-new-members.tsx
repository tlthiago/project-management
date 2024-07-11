import { api } from '@/lib/axios';

export interface InsertNewMembersBody {
  projetoId: number;
  equipe: number;
  membros: string[];
  usuInclusao: string;
}

export async function insertNewMembers({
  projetoId,
  equipe,
  membros,
  usuInclusao
}: InsertNewMembersBody) {
  const membersData = {
    projetoId,
    equipe,
    membros,
    usuInclusao
  };

  await api.post('/insert-new-members', membersData);
}
