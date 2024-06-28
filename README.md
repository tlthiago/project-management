## Notas de atualização

### alfa v1.3

#
### alfa v1.2

### Correção de bugs
#### Página: Projetos
- A listagem de projetos por membro agora está funcionando corretamente
- O status de projeto atrasado agora está reagindo corretamente as alterações de data fim do projeto

#### Página: Projetos (Tarefas)
- Os detalhes das tarefas agora estão sendo exibidos corretamente, antes todos os dialogs estavam sendo abertos ao mesmo tempo
- O dialog de exclusão da tarefa foi atualizado para o componente do tipo Alert Dialog

### Novos recursos
- A identidade do Mart Minas & DOM foi adicionada ao projeto
- A navbar foi atualizada para uma versão mais compatível a ideia do projeto

#### Página: Membros
- A função de coordenador foi adicionada as funções dos membros do projeto

#### Página: Dashboard
- Agora ao clicar nos cards o usuário é redirecionado para a página de projetos já com o status selecionado definido
- 2 gráficos foram adicionados a tela de visão geral com informações sobre os projetos e equipes
- A aba de notificações foi implementada, agora quaisquer alterações estão sendo registradas e podem ser acompanhadas nessa aba

#### Página: Projetos
- Adicionado um menu dropdown ao clicar no ícone de propriedades do projeto para que seja possível abrir uma visão detalhada, editar e arquivar o projeto por esse atalho

### Pequenos ajustes
- O nome de exibição da coluna dos nomes das equipes foi alterado de Equipes para Nomes
- O título da página de Membros agora está sendo atualizado conforme a aba selecionada

#
### alfa v1.1

Correções e funcionalidades foram adicionadas as páginas:

#### Membros:  

Agora é possível utilizar o scroll do mouse para percorrer os membros do departamento dentro do formulário de criar uma equipe;
O dialog de excluir a equipe foi atualizado.

#### Projetos: 

Agora é possível utilizar o scroll do mouse para percorrer os membros do departamento dentro do formulário de criar um projeto;

O dialog de arquivar o projeto foi atualizado;

Formulário de criar projeto:
- A adição de datas agora é opcional;
- Agora qualquer range de datas pode ser definido;
- A adição de uma descrição agora é opcional.

Listagem de dados:
- A coluna "criado por" foi adicionada a tabela de listagem de dados.

#### Projeto[id]:

Agora é possível utilizar o scroll do mouse para percorrer os membros do departamento dentro do formulário de criar uma tarefa;

O dialog de excluir a tarefa foi atualizado;

Formulário de criar projeto:
- A adição de datas agora é opcional;
- Agora qualquer range de datas pode ser definido;
- A adição de uma descrição agora é opcional.

Listagem de dados:
- A coluna "criado por" foi adicionada a tabela de listagem de dados.

#### Arquivados:
- O nome da colunaa responsáveis foi alterado para membros;
- O dialog de excluir o projeto foi atualizado.

O favicon do MartMinas foi adicionado ao projeto

Ao arquivar um projeto pela sidebar, caso a rota atual seja a mesma do projeto arquivado o usuário está sendo redirecionado para a página de projetos

Corrigimos um erro em que a listagem dos dados está sendo atualizada com apenas parte dos dados após a atualização de uma equipe, projeto ou tarefa

<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
