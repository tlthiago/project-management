import { api } from '@/lib/axios';

export interface CreateProjectBody {
  nome: string;
  dataInicio?: string;
  dataFim?: string;
  descricao?: string;
  departamento: string;
  prioridade: string;
  usuInclusao: string;
  equipesId: number[];
  chapas: string[];
}

export async function createProject({
  nome,
  dataInicio,
  dataFim,
  descricao,
  departamento,
  prioridade,
  usuInclusao,
  equipesId,
  chapas
}: CreateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    departamento,
    prioridade,
    usuInclusao,
    equipesId,
    chapas
  };

  await api.post('/create-project', projectData);
}
