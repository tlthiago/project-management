'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Circle, HelpCircle, Timer } from 'lucide-react';
import Link from 'next/link';

import { Project } from '@/app/api/data/schema';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { ProjectDetails } from '../project-details';
// import { UserAvatar } from '../user-avatar';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

// function getInitials(fullName: string): string {
//   const parts = fullName.split(' ');
//   const firstName = parts[0];
//   const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

//   const initials = firstName.charAt(0) + lastName.charAt(0);

//   return initials;
// }

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
      <Link href={`projetos/${row.getValue('id')}`}>
        <span className="font-semibold">{row.getValue('name')}</span>
      </Link>
    )
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
  // {
  //   accessorKey: 'members',
  //   header: () => <div>Responsáveis</div>,
  //   cell: ({ row }) => {
  //     const members: string[] = row.getValue('members');

  //     const avatars = members.map((member, index) => {
  //       const initials = getInitials(member);

  //       return (
  //         <UserAvatar key={index} userInitials={initials} userName={member} />
  //       );
  //     });

  //     return <div className="flex gap-1">{avatars}</div>;
  //   }
  // },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue('status');

      switch (status) {
        case 'backlog':
          return (
            <div className="flex items-center text-rose-600">
              <HelpCircle className="mr-2 h-4 w-4 " />
              <span>Atrasado</span>
            </div>
          );
        case 'todo':
          return (
            <div className="flex items-center">
              <Circle className="mr-2 h-4 w-4 " />
              <span>Pendente</span>
            </div>
          );
        case 'in progress':
          return (
            <div className="flex items-center">
              <Timer className="mr-2 h-4 w-4 " />
              <span>Em progresso</span>
            </div>
          );
        case 'done':
          return (
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 " />
              <span>Finalizado</span>
            </div>
          );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
