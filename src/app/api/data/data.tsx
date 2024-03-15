import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Circle,
  PictureInPicture,
  PlusCircle,
  RotateCw,
  SquareStack,
  Timer,
  User,
  Users,
  XCircle
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

export const actions = [
  {
    label: 'Criou',
    value: 'Criou',
    icon: PlusCircle
  },
  {
    label: 'Inseriu',
    value: 'Inseriu',
    icon: PictureInPicture
  },
  {
    label: 'Atualizou',
    value: 'Atualizou',
    icon: RotateCw
  },
  {
    label: 'Atrasou',
    value: 'Atrasou',
    icon: AlertCircle
  },
  {
    label: 'Excluiu',
    value: 'Excluiu',
    icon: XCircle
  }
];

export const entities = [
  {
    label: 'Projetos',
    value: 'Projetos',
    icon: SquareStack
  },
  {
    label: 'Tarefas',
    value: 'Tarefas',
    icon: Check
  },
  {
    label: 'Equipes',
    value: 'Equipes',
    icon: Users
  },
  {
    label: 'Membros',
    value: 'Membros',
    icon: User
  }
];

export const functionMember = [
  {
    label: 'Membro',
    value: 'Membro'
  },
  {
    label: 'Coordenador',
    value: 'Coordenador'
  },
  {
    label: 'Administrador',
    value: 'Administrador'
  }
];
