'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { GetProjectsByDepartmentResponse } from '@/app/api/projetos/get-projects-by-department';
import Priority from '@/components/priority';
import { UsersAvatar } from '@/components/users-avatar';

import ProjectStatus from '../project-status';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<GetProjectsByDepartmentResponse>[] = [
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
      const atrasado = row.getValue('ATRASADO');

      return (
        <Link href={`projetos/${row.getValue('ID')}`}>
          <span
            className={`font-semibold ${atrasado === 'S' ? 'text-rose-500' : ''}`}
          >
            {row.getValue('NOME')}
          </span>
        </Link>
      );
    }
  },
  {
    accessorKey: 'DATA_INICIO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Início" />
    ),
    cell: ({ row }) => {
      const dataInicioString: string = row.getValue('DATA_INICIO');
      const dataInicio = new Date(dataInicioString);
      const atrasado = row.getValue('ATRASADO');

      return (
        <div className={atrasado === 'S' ? 'font-semibold text-rose-500' : ''}>
          {dataInicio.toLocaleDateString('pt-BR')}
        </div>
      );
    }
  },
  {
    accessorKey: 'DATA_FIM',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Fim" />
    ),
    cell: ({ row }) => {
      const dataFimString: string = row.getValue('DATA_FIM');
      const dataFim = new Date(dataFimString);
      const atrasado = row.getValue('ATRASADO');

      return (
        <div className={atrasado === 'S' ? 'font-semibold text-rose-500' : ''}>
          {dataFim.toLocaleDateString('pt-BR')}
        </div>
      );
    }
  },
  {
    accessorKey: 'EQUIPES',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      const atrasado = row.getValue('ATRASADO');

      return (
        <div
          className={`line-clamp-1 max-w-96 ${atrasado === 'S' ? 'font-semibold text-rose-500' : ''}`}
        >
          {row.getValue('EQUIPES')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'MEMBROS',
    header: () => <div>Membros</div>,
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('MEMBROS')} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'STATUS',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const projectId: number = row.getValue('ID');
      const status: string = row.getValue('STATUS');

      return <ProjectStatus projectId={projectId} status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'PRIORIDADE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => {
      return <Priority priority={row.getValue('PRIORIDADE')} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'ATRASADO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Atrasado" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('ATRASADO')}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
