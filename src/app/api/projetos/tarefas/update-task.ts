import { api } from '@/lib/axios';

interface MemberData {
  chapas?: string[];
}

export interface UpdateTaskBody {
  taskId: number;
  nome?: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  descricao?: string;
  prioridade?: string;
  usuInclusao?: string;
  added?: MemberData;
  removed?: MemberData;
  usuAtualizacao: string;
  atrasado?: string;
}

export async function updateTask({
  taskId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  prioridade,
  added,
  removed,
  usuInclusao,
  usuAtualizacao,
  atrasado
}: UpdateTaskBody) {
  const taskData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    prioridade,
    added,
    removed,
    usuInclusao,
    usuAtualizacao,
    atrasado
  };

  await api.put(`/projects/tasks/${taskId}`, taskData);
}
