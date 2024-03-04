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

export async function getProjectsByDepartment({ department }: GetProjectsByDepartmentBody) {
  const response = await api.post<GetProjectsByDepartmentResponse[]>('projects', { department });
  
  return response.data;
}