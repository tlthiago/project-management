import { z } from 'zod';

export const projectSchema = z.object({
  nome: z.string().min(1, { message: 'O nome do projeto deve ser informado.' }),
  datas: z.object({
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
  }),
  descricao: z.string().min(1, { message: 'Descreva o projeto.' }),
  equipes: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos uma equipe.' }),
  responsaveis: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um responsável.' }),
  status: z.string(),
  prioridade: z.string().min(1, { message: 'Selecione a prioridade.' })
});

// export const projectSchema = z.object({
//   id: z.string(),
//   name: z.string().min(1, { message: 'O nome do projeto deve ser informado.' }),
//   dateRange: z
//     .object({
//       from: z.coerce.date(),
//       to: z.coerce.date()
//     })
//     .refine((data) => data.to > data.from, {
//       message: 'A de início e a data de entrega não podem ser iguais.'
//     }),
//   description: z.string().min(1, { message: 'Descreva o projeto.' }),
//   teams: z
//     .array(z.string())
//     .min(1, { message: 'Selecione pelo menos uma equipe.' }),
//   members: z
//     .array(z.string())
//     .min(1, { message: 'Selecione pelo menos um responsável.' }),
//   status: z.string(),
//   priority: z.string().min(1, { message: 'Selecione a prioridade.' })
// });

export const taskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1, { message: 'O nome da tarefa deve ser informado.' }),
  dateRange: z
    .object({
      from: z.coerce.date(),
      to: z.coerce.date()
    })
    .refine((data) => data.to > data.from, {
      message: 'A de início e a data de entrega não podem ser iguais.'
    }),
  description: z.string().min(1, { message: 'Descreva a tarefa.' }),
  members: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um responsável.' }),
  status: z.string(),
  priority: z.string().min(1, { message: 'Selecione a prioridade.' })
});

export type Project = z.infer<typeof projectSchema>;
export type Task = z.infer<typeof taskSchema>;
