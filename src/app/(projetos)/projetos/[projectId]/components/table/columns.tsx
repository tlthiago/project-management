'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UsersAvatar } from '@/components/users-avatar';

import { TaskDetails } from '../task-details';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { GetTasksByProjectResponse } from '@/app/api/projetos/get-tasks-by-project';
import Priority from '@/components/priority';
import { useState } from 'react';
import TaskStatus from '../task-status';

export const columns: ColumnDef<GetTasksByProjectResponse>[] = [
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
      const [isDetailsOpen, setIsDetailsOpen] = useState(false);
      return (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <span className="cursor-pointer font-semibold">
              {row.getValue('NOME')}
            </span>
          </DialogTrigger>
          <TaskDetails open={isDetailsOpen} taskId={row.getValue('ID')} />
        </Dialog>
      )
    }
  },
  {
    accessorKey: 'DESCRICAO',
    header: () => <div>Descrição</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 max-w-96">
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
    accessorKey: 'RESPONSAVEIS',
    header: () => <div>Responsáveis</div>,
    cell: ({ row }) => {
      return <UsersAvatar members={row.getValue('RESPONSAVEIS')} />
    }
  },
  {
    accessorKey: 'SETOR',
    header: () => <div>Setor</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 max-w-96">
          {row.getValue('SETOR')}
        </div>
      );
    },
    enableHiding: false
  },
  {
    accessorKey: 'CHAPAS',
    header: () => <div>Chapas</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 max-w-96">
          {row.getValue('CHAPAS')}
        </div>
      );
    },
    enableHiding: false
  },
  {
    accessorKey: 'STATUS',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status"/>
    ),
    cell: ({ row }) => {
      const projectId: number = row.getValue('PROJETO_ID');
      const taskId: number = row.getValue('ID');
      const status: string = row.getValue('STATUS');
  
      return <TaskStatus projectId={projectId} taskId={taskId} status={status} />;
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
