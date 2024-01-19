'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Task } from '@/app/projetos/data/schema';
import { Badge } from '@/components/ui/badge';

import { UserAvatar } from '../user-avatar';

function getInitials(fullName: string): string {
  const parts = fullName.split(' ');
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const initials = firstName.charAt(0) + lastName.charAt(0);

  return initials;
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'description',
    header: () => <div>Descrição</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 max-w-96">
          {row.getValue('description')}
        </div>
      );
    }
  },
  {
    accessorKey: 'members',
    header: () => <div>Responsáveis</div>,
    cell: ({ row }) => {
      const members: string[] = row.getValue('members');

      const avatars = members.map((member, index) => {
        const initials = getInitials(member);

        return (
          <UserAvatar key={index} userInitials={initials} userName={member} />
        );
      });

      return <div className="flex gap-1">{avatars}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue('status');

      switch (status) {
        case 'backlog':
          return (
            <Badge className="bg-rose-500 text-rose-50 hover:bg-rose-500/90">
              Atrasado
            </Badge>
          );
        case 'todo':
          return (
            <Badge className="bg-zinc-500 text-zinc-50 hover:bg-zinc-500/90">
              A fazer
            </Badge>
          );
        case 'in progress':
          return (
            <Badge className="bg-blue-500 text-blue-50 hover:bg-blue-500/90">
              Em andamento
            </Badge>
          );
        case 'completed':
          return (
            <Badge className="bg-emerald-500 text-emerald-50 hover:bg-emerald-500/90">
              Finalizado
            </Badge>
          );
      }
    }
  },
  {
    accessorKey: 'priority',
    header: () => <div>Prioridade</div>,
    cell: ({ row }) => {
      const priority: string = row.getValue('priority');

      switch (priority) {
        case 'low':
          return (
            <Badge className="bg-emerald-500 text-emerald-50 hover:bg-emerald-500/90">
              Baixa
            </Badge>
          );
        case 'medium':
          return (
            <Badge className="bg-amber-400 text-amber-50 hover:bg-amber-400/90">
              Média
            </Badge>
          );
        case 'high':
          return (
            <Badge className="bg-rose-500 text-rose-50 hover:bg-rose-500/90">
              Alta
            </Badge>
          );
      }
    }
  }
];
