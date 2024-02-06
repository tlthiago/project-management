'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Member } from '../../../page';

export const columns: ColumnDef<Member>[] = [
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
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-1'>
          <div>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-muted text-xs">TA</AvatarFallback>
            </Avatar>
          </div>
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
    }
  },
  {
    accessorKey: 'EQUIPE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('EQUIPE')}</span>;
    }
  },
  {
    accessorKey: 'FUNCAO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('FUNCAO')}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
