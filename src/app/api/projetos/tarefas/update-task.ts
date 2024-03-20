import { api } from '@/lib/axios';

interface MemberData {
  chapas?: string[];
}

export interface UpdateTaskBody {
  taskId: string;
  nome?: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  descricao?: string;
  prioridade?: string;
  usuInclusao?: string;
  added?: MemberData;
  removed?: MemberData;
  usuAtualizacao: string;
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
  usuAtualizacao
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
    usuAtualizacao
  };

  console.log(taskData);

  await api.put(`/projects/tasks/${taskId}`, taskData);
}
