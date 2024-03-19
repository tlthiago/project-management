import { api } from '@/lib/axios';

export interface GetNumberProjectsByTeamBody {
  department: string;
}

export interface GetNumberProjectsByTeamResponse {
  ID: number;
  EQUIPE: string;
  QUANTIDADE: string;
}

export async function getNumberProjectsByTeam({
  department
}: GetNumberProjectsByTeamBody) {
  const response = await api.post<GetNumberProjectsByTeamResponse[]>(
    'number-projects-by-team',
    { department }
  );

  return response.data;
}
