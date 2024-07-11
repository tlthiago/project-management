import { api } from '@/lib/axios';

export interface GetProjectByIdParams {
  projectId: number;
}

interface Members {
  CHAPA: string;
  NOME: string;
}

interface Teams {
  ID: number;
  NOME: string;
  MEMBROS: Members[];
}

export interface Tasks {
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
  RESPONSAVEIS: Members[];
}

export interface GetProjectByIdResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string | null;
  DATA_FIM: string | null;
  DESCRICAO: string | null;
  CODDEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  EQUIPES: Teams[];
  TAREFAS: Tasks[];
}

export async function getProjectById({ projectId }: GetProjectByIdParams) {
  const response = await api.get<GetProjectByIdResponse>(
    `/project/${projectId}`
  );

  return response.data;
}
