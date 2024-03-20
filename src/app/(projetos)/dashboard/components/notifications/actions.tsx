import { Badge } from '@/components/ui/badge';

export interface ActionsProps {
  actions?: string;
}

export default function Actions({ actions }: ActionsProps) {
  switch (actions) {
    case 'Criou':
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-400">
          <span>{actions}</span>
        </Badge>
      );
    case 'Inseriu':
      return (
        <Badge className="bg-yellow-400 hover:bg-yellow-300">
          <span>{actions}</span>
        </Badge>
      );
    case 'Atualizou':
      return (
        <Badge className="bg-sky-500 hover:bg-sky-400">
          <span>{actions}</span>
        </Badge>
      );
    case 'Atrasou':
      return (
        <Badge variant="destructive">
          <span>{actions}</span>
        </Badge>
      );
    case 'Excluiu':
      return (
        <Badge variant="secondary">
          <span>{actions}</span>
        </Badge>
      );
  }
}
