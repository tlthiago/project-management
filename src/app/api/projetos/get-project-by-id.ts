import { api } from '@/lib/axios';

export interface GetProjectByIdParams {
  projectId: string;
}

export interface GetProjectByIdResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string | null;
  DATA_FIM: string | null;
  DESCRICAO: string | null;
  DEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  EQUIPES_ID: string;
  EQUIPES: string;
  CHAPAS: string;
  MEMBROS: string;
}

export async function getProjectById({ projectId }: GetProjectByIdParams) {
  const response = await api.get<GetProjectByIdResponse>(
    `/projects/${projectId}`
  );

  return response.data;
}
