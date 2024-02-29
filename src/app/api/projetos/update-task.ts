import { api } from '@/lib/axios';

interface MemberData {
  chapas?: string[]
}

export interface UpdateTaskBody {
  taskId: string
  nome?: string
  dataInicio?: string
  dataFim?: string
  descricao?: string
  chapas?: string[]
  responsaveis: string[]
  prioridade?: string
  added?: MemberData
  removed?: MemberData
  usuInclusao?: string
}

export async function updateTask({
  taskId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  chapas,
  responsaveis,
  prioridade,
  added,
  removed,
  usuInclusao
}: UpdateTaskBody) {
  const taskData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    chapas,
    responsaveis,
    prioridade,
    added,
    removed,
    usuInclusao
  };
  
  await api.put(`/projects/tasks/${taskId}`, taskData);
}