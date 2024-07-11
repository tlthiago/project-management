'use client';

import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { priorities, statuses } from '@/app/api/data/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: string;
  NOME: string;
  MEMBROS: Member[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterParams?: string | null;
}

export function DataTableToolbar<TData>({
  table,
  filterParams
}: DataTableToolbarProps<TData>) {
  const { data: session } = useSession();
  const role = session?.user.FUNCAO ?? '';

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
          table.getColumn('Status')?.setFilterValue('Pendente');
          setCurrentFilterValue(['Pendente']);
          break;
        case 'Em andamento':
          table.getColumn('Status')?.setFilterValue('Em andamento');
          setCurrentFilterValue(['Em andamento']);
          break;
        case 'Finalizado':
          table.getColumn('Status')?.setFilterValue('Finalizado');
          setCurrentFilterValue(['Finalizado']);
          break;
      }
    }
  }, [table, filterParams]);

  const allRows = table.getCoreRowModel().rows;

  const teams: { label: string; value: string }[] = [];
  const teamNamesSet = new Set<string>();

  allRows.forEach((row) => {
    const rowData = row.original as {
      EQUIPES: Team[];
    };

    rowData.EQUIPES.forEach((team) => {
      if (!teamNamesSet.has(team.NOME)) {
        teamNamesSet.add(team.NOME);
        teams.push({
          label: team.NOME,
          value: team.NOME
        });
      }
    });
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar projetos..."
          value={(table.getColumn('Nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Nome')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        {(role === 'Administrador' || role === 'Gerente') && (
          <>
            {table.getColumn('Equipes') && (
              <DataTableFacetedFilter
                column={table.getColumn('Equipes')}
                title="Equipes"
                options={teams}
                filterValue={currentFilterValue}
              />
            )}
          </>
        )}
        {table.getColumn('Status') && (
          <DataTableFacetedFilter
            column={table.getColumn('Status')}
            title="Status"
            options={statuses}
            filterValue={currentFilterValue}
          />
        )}
        {table.getColumn('Prioridade') && (
          <DataTableFacetedFilter
            column={table.getColumn('Prioridade')}
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
