import { api } from '@/lib/axios';

export interface GetTeamsByDepartmentBody {
  department: string;
}

export interface GetTeamsByDepartmentResponse {
  ID: string;
  NOME: string;
  SETOR: string;
  MEMBROS: string[];
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
};

export async function getTeamsByDepartment({ department }: GetTeamsByDepartmentBody) {
  const response = await api.post<GetTeamsByDepartmentResponse[]>('/teams', { department });

  return response.data;
}