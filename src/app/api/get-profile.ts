import { api } from '@/lib/axios';

interface GetProfileResponse {
  CODUSUARIO: string;
  SEQUSUARIO: number;
  NOME: string;
  NIVEL: number;
  NROEMPRESA: number;
  CPF: string;
  CHAPA: string;
  CODSETOR: string;
  SETOR: string;
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/profile');

  return response.data;
}
