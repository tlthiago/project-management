'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { GetMembersByDepartmentResponse } from '@/app/api/departments/get-members-by-department';
import { UserAvatar } from '@/components/user-avatar';
import UpdateMemberRole from '../../update-member-role';

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          <UserAvatar member={row.getValue('NOME')} />
          <div className='flex flex-col'>
            <span className="font-semibold">{row.getValue('NOME')}</span>
            <span className="text-xs text-muted-foreground">{row.getValue('CARGO')}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'CARGO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargos" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('CARGO')}</span>;
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
      return <span>{row.getValue('EQUIPE_ID')}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'EQUIPE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('EQUIPE')}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'FUNCAO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ row }) => {
      return <UpdateMemberRole chapa={row.getValue('CHAPA')} role={row.getValue('FUNCAO')} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />
  // }
];
