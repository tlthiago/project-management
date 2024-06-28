'use client';

import { ColumnDef } from '@tanstack/react-table';

import { GetTeamsByDepartmentResponse } from '@/app/api/departments/get-teams-by-department';
import { UsersAvatar } from '@/components/users-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const teamsColumns: ColumnDef<GetTeamsByDepartmentResponse>[] = [
  {
    accessorKey: 'ID',
    header: () => <div>ID</div>,
    cell: ({ row }) => <span>{row.getValue('ID')}</span>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'NOME',
    id: 'Nomes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomes" />
    ),
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue('Nomes')}</span>;
    }
  },
  {
    accessorKey: 'MEMBROS',
    id: 'Membros',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Membros" />
    ),
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('Membros')} />;
    }
  },
  {
    accessorKey: 'CHAPAS',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chapas" />
    ),
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue('CHAPAS')}</span>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
