'use client';

import { ColumnDef } from '@tanstack/react-table';
import { isEqual, startOfDay } from 'date-fns';
import Link from 'next/link';

import { GetProjectsByDepartmentResponse } from '@/app/api/projetos/get-projects-by-department';
import Priority from '@/components/priority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { UsersAvatar } from '@/components/users-avatar';

import ProjectStatus from '../project-status';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: Member[];
}

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
          <Link href={`projetos/${row.getValue('ID')}`}>
            <span
              className={`line-clamp-1 max-w-80 font-semibold ${atrasado === 'S' ? 'text-rose-500' : limite && 'text-amber-500'}`}
            >
              {row.getValue('Nome')}
            </span>
          </Link>
        </div>
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
      const dataInicioString: Date = row.getValue('Data Início');
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
    accessorKey: 'EQUIPES',
    id: 'Equipes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      const teams: Team[] = row.getValue('Equipes');

      return (
        <div>
          {teams.map((team: Team) => (
            <span className="line-clamp-1 max-w-96" key={team.ID}>
              {team.NOME}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const teams: Team[] = row.getValue(id);
      return teams.some((team) => value.includes(team.NOME));
    }
  },
  {
    accessorKey: 'MEMBROS',
    id: 'Membros',
    header: () => <div>Membros</div>,
    cell: ({ row }) => {
      const teams: Team[] = row.getValue('Equipes');

      const members: Member[] = teams.flatMap((team) => team.MEMBROS);

      return <UsersAvatar members={members} />;
    },
    filterFn: (row, id, value) => {
      const teams: Team[] = row.getValue('EQUIPES');
      const members = teams.flatMap((team) => team.MEMBROS);
      return members.some((member) => value.includes(member.NOME));
    }
  },
  {
    accessorKey: 'STATUS',
    id: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const projectId: number = row.getValue('ID');
      const status: string = row.getValue('Status');

      return <ProjectStatus projectId={projectId} status={status} />;
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
    id: 'Criado por',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado por" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('Criado por')}</span>;
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
