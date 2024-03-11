import { api } from '@/lib/axios';

interface GetProfileResponse {
  codUsuario: string;
  seqUsuario: number;
  grupos: string[];
  nome: string;
  nivel: number;
  nroEmpresa: number;
  loginId: string;
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/profile');

  return response.data;
}
