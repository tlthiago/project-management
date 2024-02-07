import { api } from '@/lib/axios';

export interface CreateTeamBody {
  nome: string
  setor: string
  membros: string[]
  usuInclusao: string
}

export async function createTeam({
  nome,
  setor,
  membros,
  usuInclusao
}: CreateTeamBody) {
  const teamData = {
    nome,
    setor,
    membros,
    usuInclusao
  };
    
  await api.post("/team", teamData);
}