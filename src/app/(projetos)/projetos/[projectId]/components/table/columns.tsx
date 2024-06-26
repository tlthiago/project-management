'use client';

import { ColumnDef } from '@tanstack/react-table';
import { isEqual, startOfDay } from 'date-fns';
import { useState } from 'react';

import { GetTasksByProjectResponse } from '@/app/api/projetos/tarefas/get-tasks-by-project';
import Priority from '@/components/priority';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { UsersAvatar } from '@/components/users-avatar';

import { TaskDetails } from '../task-details';
import TaskStatus from '../task-status';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

interface DetailsOpenState {
  [taskId: string]: boolean;
}

export const DataTableColumns = () => {
  const [detailsOpen, setDetailsOpen] = useState<DetailsOpenState>({});

  const toggleDetails = (id: string) => {
    setDetailsOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

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
      id: 'Nome',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      cell: ({ row }) => {
        const dataFimString: string = row.getValue('Data Fim');
        const dataFim = new Date(dataFimString);

        const today = new Date();

        const limite: boolean = dataFim
          ? isEqual(startOfDay(dataFim), startOfDay(today))
          : false;

        const atrasado = row.getValue('ATRASADO');
        const id = row.getValue('ID') as string;

        return (
          <div className="flex items-center gap-2">
            {atrasado === 'S' ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Atrasado</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              limite && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Data limite</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
            <Dialog
              key={id}
              open={detailsOpen[id] || false}
              onOpenChange={() => toggleDetails(id)}
            >
              <DialogTrigger asChild>
                <span
                  className={`cursor-pointer font-semibold ${atrasado === 'S' ? 'text-rose-500' : limite && 'text-amber-500'}`}
                >
                  {row.getValue('Nome')}
                </span>
              </DialogTrigger>
              <TaskDetails open={detailsOpen[id] || false} taskId={id} />
            </Dialog>
          </div>
        );
      }
    },
    {
      accessorKey: 'DESCRICAO',
      id: 'Descrição',
      header: () => <div>Descrição</div>,
      cell: ({ row }) => {
        return (
          <span className="line-clamp-1 max-w-96">
            {row.getValue('Descrição')}
          </span>
        );
      }
    },
    {
      accessorKey: 'DATA_INICIO',
      id: 'Data Início',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Início" />
      ),
      cell: ({ row }) => {
        const dataInicioString: string = row.getValue('Data Início');
        const dataInicio = new Date(dataInicioString);

        return (
          <span>
            {dataInicioString && dataInicio.toLocaleDateString('pt-BR')}
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
        const dataFimString: string = row.getValue('Data Fim');
        const dataFim = new Date(dataFimString);
        const atrasado = row.getValue('ATRASADO');

        const today = new Date();

        const limite: boolean = dataFim
          ? isEqual(startOfDay(dataFim), startOfDay(today))
          : false;

        return (
          <span
            className={
              atrasado === 'S'
                ? 'font-semibold text-rose-500'
                : limite
                  ? 'font-semibold text-amber-500'
                  : ''
            }
          >
            {dataFimString && dataFim.toLocaleDateString('pt-BR')}
          </span>
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
      id: 'Status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const projectId: number = row.getValue('PROJETO_ID');
        const taskId: number = row.getValue('ID');
        const status: string = row.getValue('Status');

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
      accessorKey: 'USU_INCLUSAO',
      id: 'Criada por',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criada por" />
      ),
      cell: ({ row }) => {
        return <span>{row.getValue('Criada por')}</span>;
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
