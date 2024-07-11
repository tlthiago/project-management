import { api } from '@/lib/axios';

export interface Member {
  CHAPA: string;
  NOME: string;
}

export interface GetTeamsResponse {
  ID: number;
  NOME: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  MEMBROS: Member[];
}

export async function getTeams() {
  const response = await api.get<GetTeamsResponse[]>('/teams');

  return response.data;
}
