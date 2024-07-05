import { api } from '@/lib/axios';

export interface CreateProjectBody {
  nome: string;
  dataInicio?: string;
  dataFim?: string;
  descricao?: string;
  equipesId: number[];
  chapas: string[];
  prioridade: string;
  codDepartamento: string;
  usuInclusao: string;
}

export async function createProject({
  nome,
  dataInicio,
  dataFim,
  descricao,
  equipesId,
  chapas,
  prioridade,
  codDepartamento,
  usuInclusao
}: CreateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    equipesId,
    chapas,
    prioridade,
    codDepartamento,
    usuInclusao
  };

  await api.post('/create-project', projectData);
}
