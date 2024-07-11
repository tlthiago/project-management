import { api } from '@/lib/axios';

export interface GetMembersResponse {
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

export async function getMembers() {
  const response = await api.get<GetMembersResponse[]>('/members');

  return response.data;
}
