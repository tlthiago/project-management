import { api } from '@/lib/axios';

export interface GetProjectByIdParams {
  projectId: string;
}

export interface GetProjectByIdResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
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
