'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { GetProjectsByDepartmentResponse } from '@/app/api/projetos/get-projects-by-department';
import { UsersAvatar } from '@/components/users-avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import Priority from '@/components/priority';
import ProjectStatus from '../project-status';

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
    cell: ({ row }) => (
      <Link href={`projetos/${row.getValue('ID')}`}>
        <span className="font-semibold">{row.getValue('NOME')}</span>
      </Link>
    )
  },
  {
    accessorKey: 'DATA_INICIO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Início" />
    ),
    cell: ({ row }) => {
      const dataInicioString: string = row.getValue('DATA_INICIO');
      const dataInicio = new Date(dataInicioString);
      return <div>{dataInicio.toLocaleDateString('pt-BR')}</div>;
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
      return <div>{dataFim.toLocaleDateString('pt-BR')}</div>;
    }
  },
  {
    accessorKey: 'EQUIPES',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      return <div className='line-clamp-1 max-w-96'>{row.getValue('EQUIPES')}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'RESPONSAVEIS',
    header: () => <div>Responsáveis</div>,
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('RESPONSAVEIS')} />
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
      return <Priority priority={row.getValue('PRIORIDADE')} />
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
