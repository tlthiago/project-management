import { api } from '@/lib/axios';

export interface GetTeamsByDepartmentBody {
  chapa: string;
}

export interface Member {
  CHAPA: string;
  NOME: string;
}

export interface GetTeamByLeaderResponse {
  ID: number;
  NOME: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  MEMBROS: Member[];
}

export async function getTeamByLeader({ chapa }: GetTeamsByDepartmentBody) {
  const response = await api.post<GetTeamByLeaderResponse>('/team-by-leader', {
    chapa
  });

  return response.data;
}
