import { api } from '@/lib/axios';

export interface GetMembersByDepartmentBody {
  department: string;
}

export interface GetMembersByDepartmentResponse {
  CHAPA: string;
  NOME: string;
  LOJA: number;
  SETOR: string;
  CARGO: string;
  FUNCAO: string;
  EQUIPE_ID: number;
  EQUIPE: string;
};

export async function getMembersByDepartment({ department }: GetMembersByDepartmentBody) {
  const response = await api.post<GetMembersByDepartmentResponse[]>('/members', { department });

  return response.data;
}