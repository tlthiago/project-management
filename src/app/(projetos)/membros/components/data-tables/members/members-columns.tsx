'use client';

import { ColumnDef } from '@tanstack/react-table';

import { GetMembersByDepartmentResponse } from '@/app/api/departments/get-members-by-department';
import { UserAvatar } from '@/components/user-avatar';

import UpdateMemberRole from '../../update-member-role';
import { DataTableColumnHeader } from './data-table-column-header';

export const membersColumns: ColumnDef<GetMembersByDepartmentResponse>[] = [
  {
    accessorKey: 'CHAPA',
    header: () => <div>Chapa</div>,
    cell: ({ row }) => <span>{row.getValue('CHAPA')}</span>,
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
      return (
        <div className="flex items-center gap-2">
          <UserAvatar member={row.getValue('Nome')} />
          <div className="flex flex-col">
            <span className="font-semibold">{row.getValue('Nome')}</span>
            <span className="text-xs text-muted-foreground">
              {row.getValue('Cargo')}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'CARGO',
    id: 'Cargo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargos" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('Cargo')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'EQUIPE_ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('EQUIPE_ID')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'EQUIPE',
    id: 'Equipes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('Equipes')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'FUNCAO',
    id: 'Função',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ row }) => {
      return (
        <UpdateMemberRole
          chapa={row.getValue('CHAPA')}
          team={row.getValue('Equipes')}
          role={row.getValue('Função')}
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />
  // }
];
