'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { TaskDetails } from '../task-details';
import { UpdateTaskForm } from '../update-task-form';
import { DeleteTaskDialog } from '../delete-task-dialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Abrir
            </DropdownMenuItem>
          </DialogTrigger>
          <TaskDetails open={isDetailsOpen} taskId={row.getValue('ID')} />
        </Dialog>
        <Dialog open={isUpdateTaskOpen} onOpenChange={setIsUpdateTaskOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
          <UpdateTaskForm open={isUpdateTaskOpen} projectId={row.getValue('PROJETO_ID')} taskId={row.getValue('ID')} />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Excluir
            </DropdownMenuItem>
          </DialogTrigger>
          <DeleteTaskDialog taskId={row.getValue('ID')} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
