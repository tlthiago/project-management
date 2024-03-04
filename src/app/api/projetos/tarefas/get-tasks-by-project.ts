import { api } from '@/lib/axios';

export interface GetTasksByProjectParams {
  projectId?: string
}

export interface GetTasksByProjectResponse {
  ID: number;
  PROJETO_ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  STATUS: string;
  PRIORIDADE: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  CHAPAS: string;
  MEMBROS: string;
};

export async function getTasksByProject({ projectId }: GetTasksByProjectParams) {
  const response = await api.get<GetTasksByProjectResponse[]>(`/projects/${projectId}/tasks`);

  return response.data;
}
