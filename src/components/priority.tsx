import { Badge } from '@/components/ui/badge';

export interface PriorityProps {
  priority?: string;
}

export default function Priority({ priority }: PriorityProps) {
  switch (priority) {
    case 'Baixa':
      return (
        <Badge className="bg-emerald-500 text-emerald-50 hover:bg-emerald-500/90">
          {priority}
        </Badge>
      );
    case 'Média':
      return (
        <Badge className="bg-amber-400 text-amber-50 hover:bg-amber-400/90">
          {priority}
        </Badge>
      );
    case 'Alta':
      return (
        <Badge className="bg-rose-500 text-rose-50 hover:bg-rose-500/90">
          {priority}
        </Badge>
      );
  }
}
