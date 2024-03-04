import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  HelpCircle,
  Timer
} from 'lucide-react';

export const statuses = [
  {
    value: 'Pendente',
    label: 'Pendente',
    icon: Circle
  },
  {
    value: 'Em andamento',
    label: 'Em andamento',
    icon: Timer
  },
  {
    value: 'Finalizado',
    label: 'Finalizado',
    icon: CheckCircle2
  }
];

export const priorities = [
  {
    label: 'Baixa',
    value: 'Baixa',
    icon: ArrowDown
  },
  {
    label: 'Média',
    value: 'Média',
    icon: ArrowRight
  },
  {
    label: 'Alta',
    value: 'Alta',
    icon: ArrowUp
  }
];

// export const departments: Department[] = [
//   {
//     name: 'Técnologia da Informação',
//     teams: [
//       {
//         name: 'Infraestrutura',
//         subTeams: [
//           {
//             name: 'Suporte e Automação',
//             members: [
//               { name: 'Gabriel Souza' },
//               { name: 'Carolina Barbosa' },
//               { name: 'Lucas Dias' },
//               { name: 'Fábio Batista' },
//               { name: 'Lucas Alexandre' },
//               { name: 'Alexsander Rocha' },
//               { name: 'Cláudio Alves' }
//             ]
//           },
//           {
//             name: 'Governança, Segurança, Redes e Servidores',
//             members: [
//               { name: 'Robson de Paula' },
//               { name: 'Guilherme Andrade' },
//               { name: 'Marcus Oliveira' }
//             ]
//           }
//         ]
//       },
//       {
//         name: 'Sistemas',
//         subTeams: [
//           {
//             name: 'Desenvolvimento de Sistemas',
//             members: [
//               { name: 'Paulo Gonçalves' },
//               { name: 'Matheus Carvalho' },
//               { name: 'Pedro Bomfim' },
//               { name: 'Danton Rodrigues' },
//               { name: 'Thiago Alves' }
//             ]
//           },
//           {
//             name: 'Loja, Financeiro, Contábil, Fiscal, RM, Suprimentos e Logistic Mobile',
//             members: [
//               { name: 'Gabriel Matos' },
//               { name: 'Veronica Assis' },
//               { name: 'Dionata Sena' },
//               { name: 'Eduardo Ramos' },
//               { name: 'Ewerton Henrique' },
//               { name: 'Alicia Leal' }
//             ]
//           },
//           {
//             name: 'Comercial, Depto de Vendas, Logística',
//             members: [{ name: 'Kennedy Oliveira' }, { name: 'Gleiton Bessa' }]
//           },
//           {
//             name: 'Integração',
//             members: [{ name: 'Caio Wendel' }, { name: 'Marcio Moreira' }]
//           },
//           {
//             name: 'RH, DP e QSMS',
//             members: [{ name: 'Marcus Miranda' }, { name: 'Ronaldo Sena' }]
//           }
//         ]
//       },
//       {
//         name: 'Coordenação',
//         members: [{ name: 'Paula Junia' }]
//       },
//       {
//         name: 'Gerência',
//         members: [{ name: 'Helton Lima' }]
//       }
//     ]
//   }
// ];

// export const teams = [
//   {
//     label: 'Suporte e Automação',
//     value: 'Suporte e Automação',
//   },
//   {
//     label: 'Governança, Segurança, Redes e Servidores',
//     value: 'Governança, Segurança, Redes e Servidores',
//   },
//   {
//     label: 'Desenvolvimento de Sistemas',
//     value: 'Desenvolvimento de Sistemas',
//   },
//   {
//     label: 'Loja, Financeiro, Contábil, Fiscal, RM, Suprimentos e Logistic Mobile',
//     value: 'Loja, Financeiro, Contábil, Fiscal, RM, Suprimentos e Logistic Mobile',
//   },
//   {
//     label: 'Comercial, Depto de Vendas, Logística',
//     value: 'Comercial, Depto de Vendas, Logística',
//   },
//   {
//     label: 'Integração',
//     value: 'Integração',
//   },
//   {
//     label: 'RH, DP e QSMS',
//     value: 'RH, DP e QSMS',
//   },
//   {
//     label: 'Coordenação',
//     value: 'Coordenação',
//   },
//   {
//     label: 'Gerência',
//     value: 'Gerência',
//   }
// ]