import { api } from '@/lib/axios';

export interface GetTeamsByDepartmentBody {
  department: string;
}

export interface GetTeamsByDepartmentResponse {
  ID: number;
  NOME: string;
  SETOR: string;
  MEMBROS: string;
  CHAPAS: string[];
}

export async function getTeamsByDepartment({
  department
}: GetTeamsByDepartmentBody) {
  const response = await api.post<GetTeamsByDepartmentResponse[]>('/teams', {
    department
  });

  return response.data;
}
