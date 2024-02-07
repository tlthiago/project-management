'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { GetMembersByDepartmentResponse } from '@/app/api/departments/get-members-by-department';
import { UserAvatar } from '@/components/user-avatar';
import { getTeamsByDepartment, GetTeamsByDepartmentResponse } from '@/app/api/departments/get-teams-by-department';
import { useQuery } from '@tanstack/react-query';

export const membersColumns: ColumnDef<GetMembersByDepartmentResponse>[] = [
  {
    accessorKey: 'CHAPA',
    header: () => <div>Chapa</div>,
    cell: ({ row }) => <span>{row.getValue('CHAPA')}</span>,
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
        <div className='flex items-center gap-2'>
          <UserAvatar member={row.getValue('NOME')} />
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
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'EQUIPE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipes" />
    ),
    cell: ({ row }) => {
      const department = 'TECNOLOGIA DA INFORMACAO';

      const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
        queryKey: ['teams', department],
        queryFn: () => getTeamsByDepartment({ department })
      });

      for (const team of teams) {
        if (team.MEMBROS.includes(row.getValue('NOME'))) {
          return <span>{ team.NOME }</span>;
        }
      }
      
      return '';
    },
    filterFn: (row, id, value) => {
      // console.log(row);
      // console.log(id);
      // console.log(value);

      return value.includes(row.getValue(id));
    },
    
  },
  {
    accessorKey: 'FUNCAO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ row }) => {
      return <span>Membro</span>;
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
