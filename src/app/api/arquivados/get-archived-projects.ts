import { api } from '@/lib/axios';

export interface GetArchivedProjectsByDepartmentBody {
  department: string;
}

export interface GetArchivedProjectsResponse {
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
};

export async function getArchivedProjects({ department }: GetArchivedProjectsByDepartmentBody) {
  const response = await api.post<GetArchivedProjectsResponse[]>('/archived-projects', { department });

  return response.data;
}