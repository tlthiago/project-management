import { api } from '@/lib/axios';

export interface GetTaskByIdParams {
  projectId?: string;
  taskId?: string
}

export interface GetTaskByIdResponse {
  ID: string;
  PROJETO_ID: string;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  RESPONSAVEIS: string;
  STATUS: string;
  PRIORIDADE: string;
};

export async function getTaskById({ projectId, taskId }: GetTaskByIdParams) {
  const response = await api.get<GetTaskByIdResponse>(`/projects/${projectId}/tasks/${taskId}`)

  return response.data;
}