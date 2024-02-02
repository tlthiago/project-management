import { api } from '@/lib/axios';

export interface UpdateProjectBody {
  projectId: string
  nome: string
  dataInicio: string
  dataFim: string
  descricao: string
  equipes: string[]
  responsaveis: string[]
  prioridade: string
  usuInclusao: string
}

export async function updateProject({
  projectId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  equipes,
  responsaveis,
  prioridade,
  usuInclusao
}: UpdateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    equipes,
    responsaveis,
    prioridade,
    usuInclusao
  };
  
  console.log(projectId);
  console.log(projectData);
  
  // await api.put(`/projects/${projectId}`, projectData);
}