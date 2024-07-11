import { api } from '@/lib/axios';

export interface GetLogsByDepartmentBody {
  codDepartment: string;
}

export interface GetLogsByDepartmentResponse {
  ID: number;
  DATA: string;
  USUARIO: string;
  ACAO: string;
  ENTIDADE: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
}

export async function getLogsByDepartment({
  codDepartment
}: GetLogsByDepartmentBody) {
  const response = await api.post<GetLogsByDepartmentResponse[]>(
    'logs-by-department',
    { codDepartment }
  );

  return response.data;
}
