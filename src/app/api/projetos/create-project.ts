import { api } from '@/lib/axios';

export interface CreateProjectBody {
  nome: string
  dataInicio: string
  dataFim: string
  descricao: string
  setor: string
  equipesId: number[]
  equipes: string[]
  chapas: string[]
  responsaveis: string[]
  prioridade: string
  usuInclusao: string
}

export async function createProject({
  nome,
  dataInicio,
  dataFim,
  descricao,
  setor,
  equipesId,
  equipes,
  chapas,
  responsaveis,
  prioridade,
  usuInclusao
}: CreateProjectBody) {
  const projectData = {
    nome,
    dataInicio,
    dataFim,
    descricao,
    setor,
    equipesId,
    equipes,
    chapas,
    responsaveis,
    prioridade,
    usuInclusao
  };
  
  await api.post("/create-project", projectData);
}