import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  HelpCircle,
  Timer,
  XCircle
} from 'lucide-react';

import tasks from '@/app/projetos/data/tasks.json';

interface Member {
  name: string;
}
interface SubTeam {
  name: string;
  members: Member[];
}
interface Team {
  name: string;
  subTeams?: SubTeam[];
  members?: Member[];
}
interface Department {
  name: string;
  teams: Team[];
  members?: Member[];
}

export const departments: Department[] = [
  {
    name: 'Técnologia da Informação',
    teams: [
      {
        name: 'Infraestrutura',
        subTeams: [
          {
            name: 'Suporte e Automação',
            members: [
              { name: 'Gabriel Souza' },
              { name: 'Carolina Barbosa' },
              { name: 'Lucas Dias' },
              { name: 'Fábio Batista' },
              { name: 'Lucas Alexandre' },
              { name: 'Alexsander Rocha' },
              { name: 'Cláudio Alves' }
            ]
          },
          {
            name: 'Governança, Segurança, Redes e Servidores',
            members: [
              { name: 'Robson de Paula' },
              { name: 'Guilherme Andrade' },
              { name: 'Marcus Oliveira' }
            ]
          }
        ]
      },
      {
        name: 'Sistemas',
        subTeams: [
          {
            name: 'Desenvolvimento de Sistemas',
            members: [
              { name: 'Paulo Gonçalves' },
              { name: 'Matheus Carvalho' },
              { name: 'Pedro Bomfim' },
              { name: 'Danton Rodrigues' },
              { name: 'Thiago Alves' }
            ]
          },
          {
            name: 'Loja, Financeiro, Contábil, Fiscal, RM, Suprimentos e Logistic Mobile',
            members: [
              { name: 'Gabriel Matos' },
              { name: 'Veronica Assis' },
              { name: 'Dionata Sena' },
              { name: 'Eduardo Ramos' },
              { name: 'Ewerton Henrique' },
              { name: 'Alicia Leal' }
            ]
          },
          {
            name: 'Comercial, Depto de Vendas, Logística',
            members: [{ name: 'Kennedy Oliveira' }, { name: 'Gleiton Bessa' }]
          },
          {
            name: 'Integração',
            members: [{ name: 'Caio Wendel' }, { name: 'Marcio Moreira' }]
          },
          {
            name: 'RH, DP e QSMS',
            members: [{ name: 'Marcus Miranda' }, { name: 'Ronaldo Sena' }]
          }
        ]
      },
      {
        name: 'Coordenação',
        members: [{ name: 'Paula Junia' }]
      },
      {
        name: 'Gerência',
        members: [{ name: 'Helton Lima' }]
      }
    ]
  }
];

const departmentMapper = {
  mapDepartments: (departments: Department[]) => {
    return departments.map((department) => department.name);
  },
  mapTeams: (departments: Department[]) => {
    const teams: Team[] = [];

    departments.forEach((department) => {
      teams.push(...department.teams);
    });

    return teams.map((team) => team.name);
  },
  mapSubTeams: (departments: Department[]) => {
    const subTeams: SubTeam[] = [];

    departments.forEach((department) => {
      department.teams.forEach((team) => {
        if (team.subTeams) {
          subTeams.push(...team.subTeams);
        }
      });
    });

    return subTeams.map((subTeam) => subTeam.name);
  },
  mapMembers: (departments: Department[]) => {
    const members: Member[] = [];

    departments.forEach((department) => {
      if (department.members) {
        members.push(...department.members);
      }

      department.teams.forEach((team) => {
        if (team.members) {
          members.push(...team.members);
        }

        if (team.subTeams) {
          team.subTeams.forEach((subTeam) => {
            if (subTeam.members) {
              members.push(...subTeam.members);
            }
          });
        }
      });
    });

    return members.map((member) => member.name);
  }
};

export const departmentNames = departmentMapper.mapDepartments(departments);
export const teamNames = departmentMapper.mapTeams(departments);
export const subTeamNames = departmentMapper.mapSubTeams(departments);
export const memberNames = departmentMapper.mapMembers(departments);

interface User {
  name: string;
}

function getAllUsers(tasks: any[]): User[] {
  const users: User[] = [];

  tasks.forEach((task: any) => {
    const members: string[] = task.members;

    members.forEach((member: string) => {
      const user: User = {
        name: member
      };

      const existingUser = users.find((u) => u.name === user.name);

      if (!existingUser) {
        users.push(user);
      }
    });
  });

  return users;
}
const users: User[] = getAllUsers(tasks);

export const members = users.map((user) => ({
  label: user.name,
  value: user.name,
  icon: undefined
}));

export const statuses = [
  {
    value: 'backlog',
    label: 'Atrasado',
    icon: HelpCircle
  },
  {
    value: 'todo',
    label: 'Pendente',
    icon: Circle
  },
  {
    value: 'in progress',
    label: 'Em andamento',
    icon: Timer
  },
  {
    value: 'done',
    label: 'Concluído',
    icon: CheckCircle2
  },
  {
    value: 'canceled',
    label: 'Cancelado',
    icon: XCircle
  }
];

export const priorities = [
  {
    label: 'Baixa',
    value: 'low',
    icon: ArrowDown
  },
  {
    label: 'Média',
    value: 'medium',
    icon: ArrowRight
  },
  {
    label: 'Alta',
    value: 'high',
    icon: ArrowUp
  }
];
