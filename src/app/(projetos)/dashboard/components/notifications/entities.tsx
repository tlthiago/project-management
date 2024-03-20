import { Check, SquareStack, User, Users } from 'lucide-react';

export interface EntitiesProps {
  entity?: string;
}

export default function Entities({ entity }: EntitiesProps) {
  switch (entity) {
    case 'Projetos':
      return (
        <div className="flex items-center">
          <SquareStack className="mr-2 h-4 w-4 " />
          <span>{entity}</span>
        </div>
      );
    case 'Tarefas':
      return (
        <div className="flex items-center">
          <Check className="mr-2 h-4 w-4 " />
          <span>{entity}</span>
        </div>
      );
    case 'Equipes':
      return (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 " />
          <span>{entity}</span>
        </div>
      );
    case 'Membros':
      return (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 " />
          <span>{entity}</span>
        </div>
      );
  }
}
