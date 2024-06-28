import { api } from '@/lib/axios';

export interface GetCurrentProjectsByTeamParams {
  teamId: number;
}

export interface GetCurrentProjectsByTeamResponse {
  ID: number;
  NOME: string;
}

export async function getCurrentProjectsByTeam({
  teamId
}: GetCurrentProjectsByTeamParams) {
  const response = await api.get<GetCurrentProjectsByTeamResponse[]>(
    `/current-projects-by-team/${teamId}`
  );

  return response.data;
}
