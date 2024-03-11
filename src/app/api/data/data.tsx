import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
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
