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

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar equipes..."
          value={(table.getColumn('Nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Nome')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
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
