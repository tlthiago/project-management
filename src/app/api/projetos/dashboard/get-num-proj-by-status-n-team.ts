import { api } from '@/lib/axios';

export interface GetNumberProjectsByStatusAndTeamBody {
  department: string;
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
  department
}: GetNumberProjectsByStatusAndTeamBody) {
  const response = await api.post<GetNumberProjectsByStatusAndTeamResponse[]>(
    'number-projects-by-status-and-team',
    { department }
  );

  return response.data;
}
