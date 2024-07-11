'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
  const role = session?.user.FUNCAO ?? '';

  const isFiltered = table.getState().columnFilters.length > 0;

  const allRows = table.getCoreRowModel().rows;

  const cargos: { label: string; value: string }[] = [];

  allRows.forEach((row) => {
    const rowData = row.original as {
      CARGO: string;
    };

    const cargo = rowData.CARGO;

    if (!cargos.some((c) => c.value === cargo)) {
      cargos.push({
        label: cargo,
        value: cargo
      });
    }
  });

  const departments: { label: string; value: string }[] = [];

  allRows.forEach((row) => {
    const rowData = row.original as {
      DEPARTAMENTO: string;
    };

    const department = rowData.DEPARTAMENTO;

    if (!departments.some((c) => c.value === department)) {
      departments.push({
        label: department,
        value: department
      });
    }
  });

  const equipes: { label: string; value: string }[] = [];

  allRows.forEach((row) => {
    const rowData = row.original as {
      EQUIPE: string;
    };

    const equipe = rowData.EQUIPE;

    if (!equipes.some((e) => e.value === equipe)) {
      equipes.push({
        label: equipe,
        value: equipe
      });
    }
  });

  const funcoes: { label: string; value: string }[] = [];

  allRows.forEach((row) => {
    const rowData = row.original as {
      FUNCAO: string;
    };

    const funcao = rowData.FUNCAO;

    if (!funcoes.some((e) => e.value === funcao)) {
      funcoes.push({
        label: funcao,
        value: funcao
      });
    }
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar membros..."
          value={(table.getColumn('Nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Nome')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        {table.getColumn('Cargo') && (
          <DataTableFacetedFilter
            column={table.getColumn('Cargo')}
            title="Cargos"
            options={cargos}
          />
        )}
        {role === 'Administrador' && (
          <>
            {table.getColumn('Departamento') && (
              <DataTableFacetedFilter
                column={table.getColumn('Departamento')}
                title="Departamentos"
                options={departments}
              />
            )}
          </>
        )}
        {table.getColumn('Equipe') && (
          <DataTableFacetedFilter
            column={table.getColumn('Equipe')}
            title="Equipes"
            options={equipes}
          />
        )}
        {table.getColumn('Função') && (
          <DataTableFacetedFilter
            column={table.getColumn('Função')}
            title="Funções"
            options={funcoes}
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
