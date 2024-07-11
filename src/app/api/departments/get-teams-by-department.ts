import { api } from '@/lib/axios';

export interface GetTeamsByDepartmentBody {
  codDepartment: string;
}

export interface Member {
  CHAPA: string;
  NOME: string;
}

export interface GetTeamsByDepartmentResponse {
  ID: number;
  NOME: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  MEMBROS: Member[];
}

export async function getTeamsByDepartment({
  codDepartment
}: GetTeamsByDepartmentBody) {
  const response = await api.post<GetTeamsByDepartmentResponse[]>(
    '/teams-by-department',
    {
      codDepartment
    }
  );

  return response.data;
}
