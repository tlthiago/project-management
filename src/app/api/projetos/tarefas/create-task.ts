import { api } from '@/lib/axios';

export interface CreateTaskBody {
  projectId?: string;
  nome: string;
  dataInicio?: string;
  dataFim?: string;
  descricao?: string;
  chapas: string[];
  prioridade: string;
  usuInclusao: string;
}

export async function createTask({
  projectId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  chapas,
  prioridade,
  usuInclusao
}: CreateTaskBody) {
  const taskData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    chapas,
    prioridade,
    usuInclusao
  };

  await api.post(`/projects/${projectId}`, taskData);
}
