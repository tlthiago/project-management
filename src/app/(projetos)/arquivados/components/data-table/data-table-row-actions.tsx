'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogCloseFn
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { unarchiveProject } from '@/app/api/projetos/unarchive-project';
import { toast } from 'sonner';
import { deleteProject } from '@/app/api/projetos/delete-project';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { mutateAsync: unarchiveProjectFn } = useMutation({
    mutationFn: unarchiveProject
  })

  async function handleUnarchiveProject(projectId: string) {
    try {
      await unarchiveProjectFn({
        projectId: projectId
      })
      
      toast.success('O projeto foi restaurado!')
      dialogCloseFn();
    } catch {
      toast.error('Erro ao restaurar o projeto, contate o administrador.')
      dialogCloseFn();
    }
  }

  const { mutateAsync: deleteProjectFn } = useMutation({
    mutationFn: deleteProject
  })

  async function handleSubmit(projectId: string) {
    try {
      await deleteProjectFn({
        projectId: projectId
      })
      
      toast.success('O projeto foi excluído!')
      dialogCloseFn();
    } catch {
      toast.error('Erro ao excluir o projeto, contate o administrador.')
      dialogCloseFn();
    }
  }

  return (
    <Dialog>
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
          <DropdownMenuItem onClick={() => handleUnarchiveProject(row.getValue('ID'))}>Restaurar</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir projeto</DialogTitle>
        </DialogHeader>
        Tem certeza que deseja excluir o projeto? Essa ação não pode ser
        desfeita.
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" type="submit" onClick={() => handleSubmit(row.getValue('ID'))}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
