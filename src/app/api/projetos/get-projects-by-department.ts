import { api } from '@/lib/axios';

export interface GetProjectsByDepartmentBody {
  department: string;
}

export interface GetProjectsByDepartmentResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  SETOR: string;
  EQUIPES_ID: string;
  EQUIPES: string;
  CHAPAS: string;
  RESPONSAVEIS: string;
  STATUS: string;
  PRIORIDADE: string;
};

export async function getProjectsByDepartment({ department }: GetProjectsByDepartmentBody) {
  const response = await api.post<GetProjectsByDepartmentResponse[]>('projects', { department });
  
  return response.data;
}