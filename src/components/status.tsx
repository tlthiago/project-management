import { Archive, CheckCircle2, Circle, HelpCircle, Timer } from 'lucide-react';

export interface StatusProps {
  status?: string;
}

export default function Status({ status }: StatusProps) {
  switch (status) {
    case 'Arquivado':
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Archive className="h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Atrasado':
      return (
        <div className="flex items-center gap-1 font-semibold text-rose-600">
          <HelpCircle className="h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Pendente':
      return (
        <div className="flex items-center gap-1">
          <Circle className="h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Em andamento':
      return (
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Finalizado':
      return (
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
  }
}
