'use client';

import { ColumnDef } from '@tanstack/react-table';
// import { DataTableRowActions } from './data-table-row-actions';
import { format } from 'date-fns';

import { GetLogsByDepartmentResponse } from '@/app/api/projetos/get-logs-by-department';

import Actions from '../actions';
import Entities from '../entities';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<GetLogsByDepartmentResponse>[] = [
  {
    accessorKey: 'ID',
    header: () => <div>ID</div>,
    cell: ({ row }) => <span>{row.getValue('ID')}</span>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'DATA',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datas" />
    ),
    cell: ({ row }) => {
      const data = new Date(row.getValue('DATA'));

      return <span>{format(data, 'dd/MM/yyyy - HH:mm:ss')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'USUARIO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuário" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('USUARIO')}</span>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'ACAO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ação" />
    ),
    cell: ({ row }) => {
      return <Actions actions={row.getValue('ACAO')} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'ENTIDADE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entidade" />
    ),
    cell: ({ row }) => {
      return <Entities entity={row.getValue('ENTIDADE')} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'DESCRICAO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('DESCRICAO')}</span>;
    }
  },
  {
    accessorKey: 'DEPARTAMENTO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Departamento" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('DEPARTAMENTO')}</span>;
    },
    enableSorting: false,
    enableHiding: false
  }
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />
  // }
];
