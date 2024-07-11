import { api } from '@/lib/axios';

export interface GetTeamByIdParams {
  teamId: string;
}

export interface Member {
  CHAPA: string;
  NOME: string;
}

export interface GetTeamByIdResponse {
  ID: number;
  NOME: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  MEMBROS: Member[];
}

export async function getTeamById({ teamId }: GetTeamByIdParams) {
  const response = await api.get<GetTeamByIdResponse>(`/teams/${teamId}`);

  return response.data;
}
