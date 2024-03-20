import { api } from '@/lib/axios';

interface TeamMemberData {
  teamsId?: number[];
  chapas?: string[];
}

export interface UpdateProjectBody {
  projectId: string;
  nome?: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  descricao?: string;
  prioridade?: string;
  removed?: TeamMemberData;
  added?: TeamMemberData;
  usuInclusao?: string;
  usuAtualizacao: string;
  atrasado?: string;
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
  usuInclusao,
  usuAtualizacao,
  atrasado
}: UpdateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    prioridade,
    removed,
    added,
    usuInclusao,
    usuAtualizacao,
    atrasado
  };

  await api.put(`/update-project/${projectId}`, projectData);
}
