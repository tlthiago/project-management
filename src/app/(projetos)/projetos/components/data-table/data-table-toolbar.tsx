'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { memberNames, priorities, statuses, subTeamNames } from '@/app/api/data/data';
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
  const isFiltered = table.getState().columnFilters.length > 0;

  const teams = subTeamNames.map((team) => ({
    label: team,
    value: team
  }));

  const members = memberNames.map((member) => ({
    label: member,
    value: member
  }));
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar projetos..."
          value={(table.getColumn('NOME')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('NOME')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        {table.getColumn('STATUS') && (
          <DataTableFacetedFilter
            column={table.getColumn('STATUS')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('PRIORIDADE') && (
          <DataTableFacetedFilter
            column={table.getColumn('PRIORIDADE')}
            title="Prioridade"
            options={priorities}
          />
        )}
        {table.getColumn('EQUIPES') && (
          <DataTableFacetedFilter
            column={table.getColumn('EQUIPES')}
            title="Equipes"
            options={teams}
          />
        )}
        {table.getColumn('RESPONSAVEIS') && (
          <DataTableFacetedFilter
            column={table.getColumn('RESPONSAVEIS')}
            title="Responsáveis"
            options={members}
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
