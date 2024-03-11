'use client';

import { useQuery } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';

import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const { data: session } = useSession();

  const department = session?.user.SETOR ?? '';
  const isFiltered = table.getState().columnFilters.length > 0;

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department })
  });

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', department],
    queryFn: () => getTeamsByDepartment({ department })
  });

  const cargos: { label: string; value: string }[] = [];

  members.forEach((member) => {
    if (!cargos.some((cargo) => cargo.value === member.CARGO)) {
      cargos.push({
        label: member.CARGO,
        value: member.CARGO
      });
    }
  });

  const teamsList: { label: string; value: string }[] = [];

  teams.forEach((team) => {
    teamsList.push({
      label: team.NOME,
      value: team.NOME
    });
  });

  teamsList.push({
    label: 'Não alocado',
    value: 'Não alocado'
  });

  const funcaoList: { label: string; value: string }[] = [];
  members.forEach((member) => {
    if (!funcaoList.some((funcao) => funcao.value === member.FUNCAO)) {
      funcaoList.push({
        label: member.FUNCAO,
        value: member.FUNCAO
      });
    }
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar membros..."
          value={(table.getColumn('NOME')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('NOME')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        {table.getColumn('CARGO') && (
          <DataTableFacetedFilter
            column={table.getColumn('CARGO')}
            title="Cargos"
            options={cargos}
          />
        )}
        {table.getColumn('EQUIPE') && (
          <DataTableFacetedFilter
            column={table.getColumn('EQUIPE')}
            title="Equipes"
            options={teamsList}
          />
        )}
        {table.getColumn('FUNCAO') && (
          <DataTableFacetedFilter
            column={table.getColumn('FUNCAO')}
            title="Função"
            options={funcaoList}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
