import { api } from '@/lib/axios';

export interface CreateProjectBody {
  nome: string
  dataInicio: Date
  dataFim: Date
  descricao: string
  equipes: string[]
  responsaveis: string[]
  prioridade: string
}

export async function createProject({
  nome,
  dataInicio,
  dataFim,
  descricao,
  equipes,
  responsaveis,
  prioridade
}: CreateProjectBody) {
  await api.post("/projects", {
    nome,
    dataInicio,
    dataFim,
    descricao,
    equipes,
    responsaveis,
    prioridade
  })
}