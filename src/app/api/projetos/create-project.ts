import { api } from '@/lib/axios';

export interface CreateProjectBody {
  nome: string
  dataInicio: string
  dataFim: string
  descricao: string
  equipes: string[]
  responsaveis: string[]
  prioridade: string
  usuInclusao: string
}

export async function createProject({
  nome,
  dataInicio,
  dataFim,
  descricao,
  equipes,
  responsaveis,
  prioridade,
  usuInclusao
}: CreateProjectBody) {
  await api.post("/projects", {
    nome,
    dataInicio,
    dataFim,
    descricao,
    equipes,
    responsaveis,
    prioridade,
    usuInclusao
  })
}