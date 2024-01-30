import { HelpCircle, Circle, Timer, CheckCircle2, Archive } from "lucide-react";

export interface StatusProps {
  status?: string;
}

export default function Status({ status }: StatusProps) {
  switch (status) {
    case 'Arquivado':
      return (
        <div className="flex items-center text-muted-foreground">
          <Archive className="mr-2 h-4 w-4 " />
          <span>{status}</span>
        </div>
      )
    case 'Atrasado':
      return (
        <div className="flex items-center text-rose-600 font-semibold">
          <HelpCircle className="mr-2 h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Pendente':
      return (
        <div className="flex items-center">
          <Circle className="mr-2 h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Em andamento':
      return (
        <div className="flex items-center">
          <Timer className="mr-2 h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
    case 'Finalizado':
      return (
        <div className="flex items-center">
          <CheckCircle2 className="mr-2 h-4 w-4 " />
          <span>{status}</span>
        </div>
      );
  }
}