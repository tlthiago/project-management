import { api } from '@/lib/axios';

export interface GetTeamCoordinatorByTeamIdParams {
  teamId?: number;
}

export interface GetTeamCoordinatorByTeamIdResponse {
  CHAPA: string;
  NOME: string;
}

export async function getTeamCoordinatorByTeamId({
  teamId
}: GetTeamCoordinatorByTeamIdParams) {
  const response = await api.get<GetTeamCoordinatorByTeamIdResponse>(
    `/team-coordinator/${teamId}`
  );

  return response.data;
}
