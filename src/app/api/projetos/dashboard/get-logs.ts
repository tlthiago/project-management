import { api } from '@/lib/axios';

export interface GetLogsResponse {
  ID: number;
  DATA: string;
  USUARIO: string;
  ACAO: string;
  ENTIDADE: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
}

export async function getLogs() {
  const response = await api.get<GetLogsResponse[]>('/logs');

  return response.data;
}
