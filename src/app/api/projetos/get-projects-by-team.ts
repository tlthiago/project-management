import { api } from '@/lib/axios';

export interface GetProjectsByTeamBody {
  codDepartment: string;
  chapa: string;
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
  EQUIPES: Team[];
}

export async function getProjectsByTeam({
  codDepartment,
  chapa
}: GetProjectsByTeamBody) {
  const response = await api.post<GetProjectsByTeamResponse[]>(
    'projects-by-team',
    {
      codDepartment,
      chapa
    }
  );

  return response.data;
}
