import { api } from '@/lib/axios';

export interface GetArchivedProjectsResponse {
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

export async function getArchivedProjects() {
  const response = await api.get<GetArchivedProjectsResponse[]>('/archived-projects');

  return response.data;
}