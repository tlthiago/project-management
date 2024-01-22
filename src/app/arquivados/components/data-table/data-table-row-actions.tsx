'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
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
        <DropdownMenuItem>Abrir</DropdownMenuItem>
        <DropdownMenuItem>Restaurar</DropdownMenuItem>
        <Dialog>
          <DialogTrigger>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Excluir projeto</DialogTitle>
            <DialogContent>
              Tem certeza que deseja excluir o contrato? Essa ação não pode ser
              desfeita.
            </DialogContent>
            <DialogFooter>
              <Button variant="secondary">Cancelar</Button>
              <Button variant="destructive">Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
