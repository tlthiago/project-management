'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import { GetTasksByProjectResponse } from '@/app/api/projetos/tarefas/get-tasks-by-project';
import Priority from '@/components/priority';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UsersAvatar } from '@/components/users-avatar';

import { TaskDetails } from '../task-details';
import TaskStatus from '../task-status';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const DataTableColumns = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const columns: ColumnDef<GetTasksByProjectResponse>[] = [
    {
      accessorKey: 'ID',
      header: () => <div>ID</div>,
      cell: ({ row }) => <span>{row.getValue('ID')}</span>,
      enableHiding: false
    },
    {
      accessorKey: 'PROJETO_ID',
      header: () => <div>Projeto ID</div>,
      cell: ({ row }) => <span>{row.getValue('PROJETO_ID')}</span>,
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
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <span
                className={`cursor-pointer font-semibold ${atrasado === 'S' ? 'text-rose-500' : ''}`}
              >
                {row.getValue('NOME')}
              </span>
            </DialogTrigger>
            <TaskDetails open={isDetailsOpen} taskId={row.getValue('ID')} />
          </Dialog>
        );
      }
    },
    {
      accessorKey: 'DESCRICAO',
      header: () => <div>Descrição</div>,
      cell: ({ row }) => {
        const atrasado = row.getValue('ATRASADO');

        return (
          <div
            className={`line-clamp-1 max-w-96 ${atrasado === 'S' ? 'font-semibold text-rose-500' : ''}`}
          >
            {row.getValue('DESCRICAO')}
          </div>
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
          <div
            className={atrasado === 'S' ? 'font-semibold text-rose-500' : ''}
          >
            {dataInicioString === null
              ? dataInicioString
              : dataInicio.toLocaleDateString('pt-BR')}
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
          <div
            className={atrasado === 'S' ? 'font-semibold text-rose-500' : ''}
          >
            {dataFimString === null
              ? dataFimString
              : dataFim.toLocaleDateString('pt-BR')}
          </div>
        );
      }
    },
    {
      accessorKey: 'MEMBROS',
      header: () => <div>Membros</div>,
      cell: ({ row }) => {
        return <UsersAvatar members={row.getValue('MEMBROS')} />;
      }
    },
    {
      accessorKey: 'CHAPAS',
      header: () => <div>Chapas</div>,
      cell: ({ row }) => {
        return (
          <div className="line-clamp-1 max-w-96">{row.getValue('CHAPAS')}</div>
        );
      },
      enableHiding: false
    },
    {
      accessorKey: 'STATUS',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const projectId: number = row.getValue('PROJETO_ID');
        const taskId: number = row.getValue('ID');
        const status: string = row.getValue('STATUS');

        return (
          <TaskStatus projectId={projectId} taskId={taskId} status={status} />
        );
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
      accessorKey: 'USU_INCLUSAO',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criada por" />
      ),
      cell: ({ row }) => {
        return <span>{row.getValue('USU_INCLUSAO')}</span>;
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

  return { columns };
};
