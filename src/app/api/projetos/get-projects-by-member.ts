import { api } from '@/lib/axios';

export interface GetProjectsByChapaParams {
  chapa: string;
}

export interface GetProjectsByChapaResponse {
  ID: string;
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

export async function getProjectsByChapa({ chapa }: GetProjectsByChapaParams) {
  const response = await api.get<GetProjectsByChapaResponse[]>(`/projects-by-chapa/${chapa}`);

  return response.data;
}