import { api } from '@/lib/axios';

export interface GetNumberProjectsByStatusAndTeamBody {
  codDepartment: string;
}

export interface GetNumberProjectsByStatusAndTeamResponse {
  ID: number;
  NOME: string;
  PENDENTE: number;
  EM_ANDAMENTO: number;
  FINALIZADO: number;
  ATRASADO: number;
}

export async function getNumberProjectsByStatusAndTeam({
  codDepartment
}: GetNumberProjectsByStatusAndTeamBody) {
  const response = await api.post<GetNumberProjectsByStatusAndTeamResponse[]>(
    'number-projects-by-status-and-team',
    { codDepartment }
  );

  return response.data;
}
