import { api } from '@/lib/axios';

export interface GetMembersByDepartmentBody {
  department: string;
}

export interface GetMembersByDepartmentResponse {
  NOME: string;
  CHAPA: string;
  LOJA: string;
  SETOR: string;
  CARGO: string;
};

export async function getMembersByDepartment({ department }: GetMembersByDepartmentBody) {
  const response = await api.post<GetMembersByDepartmentResponse[]>('/members', { department });

  return response.data;
}