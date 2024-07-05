'use client';

import { ColumnDef } from '@tanstack/react-table';

import { GetTeamsByDepartmentResponse } from '@/app/api/departments/get-teams-by-department';
import { UsersAvatar } from '@/components/users-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

interface Member {
  CHAPA: string;
  NOME: string;
}

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
      const members: Member[] = row.getValue('Membros');

      return <UsersAvatar members={members} />;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
