import { api } from '@/lib/axios';

export interface GetProjectByIdParams {
  projectId: string
}

export interface GetProjectByIdResponse {
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

export async function getProjectById({ projectId }: GetProjectByIdParams) {
  console.log(projectId);
  
  const response = await api.get<GetProjectByIdResponse>(`/projects/${projectId}`)

  return response.data;
}