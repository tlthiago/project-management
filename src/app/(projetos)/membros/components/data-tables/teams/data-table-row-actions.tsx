'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DeleteTeam } from '../../delete-team-dialog';
import { UpdateTeamForm } from '../../update-team-form';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const [isUpdateTeamOpen, setIsUpdateTeamOpen] = useState(false);
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);

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
        <Dialog open={isUpdateTeamOpen} onOpenChange={setIsUpdateTeamOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
          <UpdateTeamForm open={isUpdateTeamOpen} teamId={row.getValue('ID')} />
        </Dialog>
        <AlertDialog open={isDeleteTeamOpen} onOpenChange={setIsDeleteTeamOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DeleteTeam open={isDeleteTeamOpen} teamId={row.getValue('ID')} />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
