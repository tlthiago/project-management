import { api } from '@/lib/axios';

export interface GetMembersByDepartmentBody {
  codDepartment: string;
}

export interface GetMembersByDepartmentResponse {
  CHAPA: string;
  NOME: string;
  LOJA: number;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  CARGO: string;
  FUNCAO: string;
  EQUIPE_ID: number;
  EQUIPE: string;
}

export async function getMembersByDepartment({
  codDepartment
}: GetMembersByDepartmentBody) {
  const response = await api.post<GetMembersByDepartmentResponse[]>(
    '/members-by-department',
    { codDepartment }
  );

  return response.data;
}
