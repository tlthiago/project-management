'use client';

import { useQuery } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { priorities, statuses } from '@/app/api/data/data';
import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { CreateTaskForm } from '../create-task-form';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const delayedTotalValue =
    table.getColumn('ATRASADO')?.getFacetedUniqueValues().get('S') ?? 0;

  const [createTaskForm, setCreateTaskForm] = useState(false);

  const [projectId, setProjectId] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split('/');
    const projectId = parseInt(segments[segments.length - 1]);
    setProjectId(projectId);
  }, [pathname]);

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Dialog open={createTaskForm} onOpenChange={setCreateTaskForm}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-8"
              disabled={project?.STATUS === 'Finalizado'}
            >
              Nova tarefa
            </Button>
          </DialogTrigger>
          <CreateTaskForm projectId={projectId} open={createTaskForm} />
        </Dialog>
        <Input
          placeholder="Buscar tarefas..."
          value={(table.getColumn('Nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Nome')?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        {table.getColumn('Status') && (
          <DataTableFacetedFilter
            column={table.getColumn('Status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('Prioridade') && (
          <DataTableFacetedFilter
            column={table.getColumn('Prioridade')}
            title="Prioridade"
            options={priorities}
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
            <span>Atrasadas</span>
            <span className="font-mono text-xs">{delayedTotalValue}</span>
          </div>
        </Button>
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
