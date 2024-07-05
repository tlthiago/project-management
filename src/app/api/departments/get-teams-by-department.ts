import { api } from '@/lib/axios';

export interface GetTeamsByDepartmentBody {
  codDepartment: string;
}

export interface GetTeamsByDepartmentResponse {
  ID: number;
  NOME: string;
  DEPARTAMENTO: string;
  MEMBROS: [];
}

export async function getTeamsByDepartment({
  codDepartment
}: GetTeamsByDepartmentBody) {
  const response = await api.post<GetTeamsByDepartmentResponse[]>('/teams', {
    codDepartment
  });

  return response.data;
}
