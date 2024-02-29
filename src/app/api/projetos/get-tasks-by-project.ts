import { api } from '@/lib/axios';

export interface GetTasksByProjectParams {
  projectId?: string
}

export interface GetTasksByProjectResponse {
  ID: string;
  PROJETO_ID: string;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  SETOR: string;
  CHAPAS: string;
  RESPONSAVEIS: string;
  STATUS: string;
  PRIORIDADE: string;
};

export async function getTasksByProject({ projectId }: GetTasksByProjectParams) {
  const response = await api.get<GetTasksByProjectResponse[]>(`/projects/${projectId}/tasks`);

  return response.data;
}
