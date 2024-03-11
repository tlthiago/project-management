import { api } from '@/lib/axios';

export interface GetTeamByIdParams {
  teamId: string;
}

export interface GetTeamByIdResponse {
  ID: string;
  NOME: string;
  SETOR: string;
  MEMBROS: string;
  CHAPAS: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
}

export async function getTeamById({ teamId }: GetTeamByIdParams) {
  const response = await api.get<GetTeamByIdResponse>(`/teams/${teamId}`);

  return response.data;
}
