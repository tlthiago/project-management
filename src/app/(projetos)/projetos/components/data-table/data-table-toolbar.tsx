'use client';

import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { priorities, statuses } from '@/app/api/data/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterParams?: string | null;
}

export function DataTableToolbar<TData>({
  table,
  filterParams
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const delayedTotalValue =
    table.getColumn('ATRASADO')?.getFacetedUniqueValues().get('S') ?? 0;

  const [currentFilterValue, setCurrentFilterValue] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    if (filterParams && filterParams !== null) {
      switch (filterParams) {
        case 'ATRASADO':
          table.getColumn(`${filterParams}`)?.setFilterValue('S');
          break;
        case 'Pendente':
          table.getColumn('STATUS')?.setFilterValue('Pendente');
          setCurrentFilterValue(['Pendente']);
          break;
        case 'Em andamento':
          table.getColumn('STATUS')?.setFilterValue('Em andamento');
          setCurrentFilterValue(['Em andamento']);
          break;
        case 'Finalizado':
          table.getColumn('STATUS')?.setFilterValue('Finalizado');
          setCurrentFilterValue(['Finalizado']);
          break;
      }
    }
  }, [table, filterParams]);

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
            filterValue={currentFilterValue}
          />
        )}
        {table.getColumn('PRIORIDADE') && (
          <DataTableFacetedFilter
            column={table.getColumn('PRIORIDADE')}
            title="Prioridade"
            options={priorities}
            filterValue={currentFilterValue}
          />
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          onClick={() => table.getColumn('ATRASADO')?.setFilterValue('S')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <div className="space-x-2">
            <span>Atrasados</span>
            <span className="font-mono text-xs">{delayedTotalValue}</span>
          </div>
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setCurrentFilterValue([]);
            }}
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
