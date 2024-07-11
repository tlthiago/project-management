import { api } from '@/lib/axios';

export interface GetTaskByIdParams {
  taskId: number;
}

export interface Member {
  CHAPA: string;
  NOME: string;
}

export interface GetTaskByIdResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string | null;
  DATA_FIM: string | null;
  DESCRICAO: string | null;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  RESPONSAVEIS: Member[];
}

export async function getTaskById({ taskId }: GetTaskByIdParams) {
  const response = await api.get<GetTaskByIdResponse>(
    `/projects/tasks/${taskId}`
  );

  return response.data;
}
