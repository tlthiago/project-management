import { api } from '@/lib/axios';

export interface GetProjectsResponse {
  id: string;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  descricao: string;
  equipes: string[];
  responsaveis: string[];
  status: string;
  proridade: string;
}
[];

export async function getProjects() {
  const response = await api.get<GetProjectsResponse>('/projects');

  return response.data;
}
