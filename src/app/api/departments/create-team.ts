import { api } from '@/lib/axios';

export interface CreateTeamBody {
  nome: string;
  codDepartamento: string;
  membros: string[];
  usuInclusao: string;
}

export async function createTeam({
  nome,
  codDepartamento,
  membros,
  usuInclusao
}: CreateTeamBody) {
  const teamData = {
    nome,
    codDepartamento,
    membros,
    usuInclusao
  };

  await api.post('/teams/create', teamData);
}
