import { api } from '@/lib/axios';

interface GetMemberByChapaParams {
  chapa: string
}

export interface GetMemberByChapaResponse {
  NOME: string;
  CHAPA: string;
  LOJA: number;
  SETOR: string;
  CARGO: string;
  EQUIPE_ID: number;
  EQUIPE: string;
  FUNCAO: string;
};

export async function getMemberByChapa({ chapa }: GetMemberByChapaParams) {
  const response = await api.get<GetMemberByChapaResponse>(`/member/${ chapa }`);

  return response.data;
}