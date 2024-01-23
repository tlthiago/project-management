'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Archive } from 'lucide-react';

import { Project } from '@/app/api/data/schema';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserAvatar } from '@/components/user-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

function getInitials(fullName: string): string {
  const parts = fullName.split(' ');
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const initials = firstName.charAt(0) + lastName.charAt(0);

  return initials;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: () => <div>ID</div>,
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue('name')}</span>
    )
  },
  {
    accessorKey: 'dateRange',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datas" />
    ),
    cell: ({ row }) => {
      const dateRange = row.getValue('dateRange') as {
        from: Date;
        to: Date;
      };
      return (
        <div>
          {dateRange.from.toLocaleDateString('pt-BR')} a{' '}
          {dateRange.to.toLocaleDateString('pt-BR')}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: () => {
      return (
        <div className="flex items-center text-muted-foreground">
          <Archive className="mr-2 h-4 w-4 " />
          <span>Arquivado</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
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
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
