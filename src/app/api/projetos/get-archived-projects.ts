import { api } from '@/lib/axios';

export interface GetArchivedProjectsByDepartmentBody {
  department: string;
}

export interface GetArchivedProjectsResponse {
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

export async function getArchivedProjects({ department }: GetArchivedProjectsByDepartmentBody) {
  const response = await api.post<GetArchivedProjectsResponse[]>('/archived-projects', { department });

  return response.data;
}