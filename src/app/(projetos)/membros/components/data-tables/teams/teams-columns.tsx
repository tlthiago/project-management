'use client';

import { ColumnDef } from '@tanstack/react-table';

import { UsersAvatar } from '@/components/users-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { GetTeamsByDepartmentResponse } from '@/app/api/departments/get-teams-by-department';

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <span className='font-semibold'>{row.getValue('NOME')}</span>;
    }
  },
  {
    accessorKey: 'MEMBROS',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Membros" />
    ),
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('MEMBROS')} />;
    }
  },
  {
    accessorKey: 'CHAPAS',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chapas" />
    ),
    cell: ({ row }) => {
      return <span className='font-semibold'>{row.getValue('CHAPAS')}</span>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
