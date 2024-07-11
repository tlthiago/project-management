import { api } from '@/lib/axios';

export interface GetProjectsByChapaParams {
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

interface GetProjectsByChapaResponse {
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

export async function getProjectsByChapa({ chapa }: GetProjectsByChapaParams) {
  const response = await api.get<GetProjectsByChapaResponse[]>(
    `/projects-by-chapa/${chapa}`
  );

  return response.data;
}
