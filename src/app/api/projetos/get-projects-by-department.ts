import { api } from '@/lib/axios';

export interface GetProjectsByDepartmentBody {
  codDepartment: string;
}

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: Member[];
}

interface GetProjectsByDepartmentResponse {
  ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  EQUIPES: Team[];
}

export async function getProjectsByDepartment({
  codDepartment
}: GetProjectsByDepartmentBody) {
  const response = await api.post<GetProjectsByDepartmentResponse[]>(
    'projects-by-department',
    { codDepartment }
  );

  return response.data;
}
