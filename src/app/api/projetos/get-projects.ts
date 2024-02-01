import { api } from '@/lib/axios';

export interface GetProjectsResponse {
  ID: string;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  EQUIPES: string;
  RESPONSAVEIS: string;
  STATUS: string;
  PRIORIDADE: string;
};

export async function getProjects() {
  const response = await api.get<GetProjectsResponse[]>('/projects');

  return response.data;
}