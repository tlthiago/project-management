import { api } from '@/lib/axios';

export interface GetLogsByDepartmentBody {
  department: string;
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
  department
}: GetLogsByDepartmentBody) {
  const response = await api.post<GetLogsByDepartmentResponse[]>(
    'projects-logs',
    { department }
  );

  return response.data;
}
