import { api } from '@/lib/axios';

export interface UpdateTaskBody {
  taskId: string
  nome: string
  dataInicio: string
  dataFim: string
  descricao: string
  responsaveis: string[]
  prioridade: string
  usuInclusao: string
}

export async function updateTask({
  taskId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  responsaveis,
  prioridade,
  usuInclusao
}: UpdateTaskBody) {
  const taskData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    responsaveis,
    prioridade,
    usuInclusao
  };
  
  await api.put(`/projects/tasks/${taskId}`, taskData);
}