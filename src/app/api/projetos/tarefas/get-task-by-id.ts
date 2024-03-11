import { api } from '@/lib/axios';

export interface GetTaskByIdParams {
  taskId?: string;
}

export interface GetTaskByIdResponse {
  ID: number;
  PROJETO_ID: number;
  NOME: string;
  DATA_INICIO: string | null;
  DATA_FIM: string | null;
  DESCRICAO: string | null;
  STATUS: string;
  PRIORIDADE: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  CHAPAS: string;
  MEMBROS: string;
}

export async function getTaskById({ taskId }: GetTaskByIdParams) {
  const response = await api.get<GetTaskByIdResponse>(
    `/projects/tasks/${taskId}`
  );

  return response.data;
}
