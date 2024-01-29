import { api } from '@/lib/axios';

export interface GetTasksResponse {
  id: string;
  projetoId: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  responsaveis: string[];
  status: string;
  proridade: string;
};

export async function getTasks(projectId: string) {
  const response = await api.get<GetTasksResponse[]>(`/projects/${projectId}/tasks`);

  return response.data;
}
