import { api } from '@/lib/axios';

export interface GetProjectsByTeamBody {
  department: string;
  chapa: string;
}

export interface GetProjectsByTeamResponse {
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
  EQUIPES_ID: string;
  EQUIPES: string;
  CHAPAS: string;
  MEMBROS: string;
}

export async function getProjectsByTeam({
  department,
  chapa
}: GetProjectsByTeamBody) {
  const response = await api.post<GetProjectsByTeamResponse[]>(
    'projects-by-team',
    {
      department,
      chapa
    }
  );

  return response.data;
}
