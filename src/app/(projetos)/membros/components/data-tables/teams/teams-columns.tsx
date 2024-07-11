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
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue('Nome')}</span>;
    }
  },
  {
    accessorKey: 'CODDEPARTAMENTO',
    id: 'codDepartamento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="codDepartamento" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('codDepartamento')}</span>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'DEPARTAMENTO',
    id: 'Departamento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Departamento" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('Departamento')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
