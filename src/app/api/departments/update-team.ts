import { api } from '@/lib/axios';

export interface UpdateTeamBody {
  teamId: string
  nome: string
  membros: string[]
  usuInclusao: string
}

export async function updateTeam({
  teamId,
  nome,
  membros,
  usuInclusao
}: UpdateTeamBody) {
  const teamData = {
    nome,
    membros,
    usuInclusao
  };
    
  await api.put(`/team/${teamId}`, teamData);
}