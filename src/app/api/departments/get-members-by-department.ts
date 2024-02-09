import { api } from '@/lib/axios';

export interface GetMembersByDepartmentBody {
  department: string;
}

export interface GetMembersByDepartmentResponse {
  NOME: string;
  CHAPA: string;
  LOJA: number;
  SETOR: string;
  CARGO: string;
  EQUIPE_ID: number;
  EQUIPE: string;
  FUNCAO: string;
};

export async function getMembersByDepartment({ department }: GetMembersByDepartmentBody) {
  const response = await api.post<GetMembersByDepartmentResponse[]>('/members', { department });

  return response.data;
}