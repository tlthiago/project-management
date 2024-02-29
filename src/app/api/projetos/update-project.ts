import { api } from '@/lib/axios';

interface TeamMemberData {
  teamsId?: number[],
  chapas?: string[]
}

export interface UpdateProjectBody {
  projectId: string
  nome?: string
  dataInicio?: string
  dataFim?: string
  descricao?: string
  prioridade?: string
  removed?: TeamMemberData
  added?: TeamMemberData
  setor?: string
  equipesId?: number[]
  equipes?: string[]
  chapas?: string[]
  responsaveis?: string[]
  usuInclusao?: string
}

export async function updateProject({
  projectId,
  nome,
  dataInicio,
  dataFim,
  descricao,
  prioridade,
  removed,
  added,
  setor,
  equipesId,
  equipes,
  chapas,
  responsaveis,
  usuInclusao
}: UpdateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    prioridade,
    removed,
    added,
    setor,
    equipesId,
    equipes,
    chapas,
    responsaveis,
    usuInclusao
  };
  
  await api.put(`/update-project/${projectId}`, projectData);
}