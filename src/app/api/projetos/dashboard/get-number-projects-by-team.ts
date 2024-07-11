import { api } from '@/lib/axios';

export interface GetNumberProjectsByTeamBody {
  codDepartment: string;
}

export interface GetNumberProjectsByTeamResponse {
  ID: number;
  EQUIPE: string;
  QUANTIDADE: string;
}

export async function getNumberProjectsByTeam({
  codDepartment
}: GetNumberProjectsByTeamBody) {
  const response = await api.post<GetNumberProjectsByTeamResponse[]>(
    'number-projects-by-team',
    { codDepartment }
  );

  return response.data;
}
