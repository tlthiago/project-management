'use client';

import { ColumnDef } from '@tanstack/react-table';

import { GetArchivedProjectsResponse } from '@/app/api/arquivados/get-archived-projects';
import Priority from '@/components/priority';
import Status from '@/components/status';
import { UsersAvatar } from '@/components/users-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<GetArchivedProjectsResponse>[] = [
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
    accessorKey: 'DATA_INICIO',
    id: 'Data Início',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Início" />
    ),
    cell: ({ row }) => {
      const dataInicio: Date = new Date(row.getValue('Data Início'));

      return (
        <span>
          {row.getValue('Data Início') !== null &&
            dataInicio.toLocaleDateString('pt-BR')}
        </span>
      );
    }
  },
  {
    accessorKey: 'DATA_FIM',
    id: 'Data Fim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Fim" />
    ),
    cell: ({ row }) => {
      const dataFim: Date = new Date(row.getValue('Data Fim'));

      return (
        <span>
          {row.getValue('Data Fim') !== null &&
            dataFim.toLocaleDateString('pt-BR')}
        </span>
      );
    }
  },
  {
    accessorKey: 'EQUIPES',
    id: 'Equipes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 max-w-96">{row.getValue('Equipes')}</div>
      );
    }
  },
  {
    accessorKey: 'MEMBROS',
    id: 'Membros',
    header: () => <div>Membros</div>,
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('Membros')} />;
    }
  },
  {
    accessorKey: 'STATUS',
    id: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <Status status={row.getValue('Status')} />;
    }
  },
  {
    accessorKey: 'PRIORIDADE',
    id: 'Prioridade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => {
      return <Priority priority={row.getValue('Prioridade')} />;
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
