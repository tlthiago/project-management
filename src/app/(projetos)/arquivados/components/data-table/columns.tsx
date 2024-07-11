'use client';

import { ColumnDef } from '@tanstack/react-table';

import Priority from '@/components/priority';
import Status from '@/components/status';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { UsersAvatar } from '@/components/users-avatar';

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

interface Project {
  ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  EQUIPES: Team[];
}

export const columns: ColumnDef<Project>[] = [
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
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="line-clamp-1 max-w-52 font-semibold">
                {row.getValue('Nome')}
              </span>
            </TooltipTrigger>
            <TooltipContent align="start">
              {row.getValue('Nome')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
