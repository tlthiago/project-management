'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteTeam } from '@/app/api/departments/delete-team';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { UpdateTeamForm } from '../../update-team-form';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const [isUpdateTeamOpen, setIsUpdateTeamOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: deleteTeamFn } = useMutation({
    mutationFn: deleteTeam,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['teams', department] });
      queryClient.invalidateQueries({ queryKey: ['members', department] });
    }
  });

  async function handleSubmit(teamId: string) {
    try {
      await deleteTeamFn({
        teamId: teamId
      });

      toast.success('A equipe foi excluída!');
    } catch {
      toast.error('Erro ao excluir a equipe, contate o administrador.');
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
          <Dialog open={isUpdateTeamOpen} onOpenChange={setIsUpdateTeamOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <UpdateTeamForm
              open={isUpdateTeamOpen}
              teamId={row.getValue('ID')}
            />
          </Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir projeto</DialogTitle>
        </DialogHeader>
        Tem certeza que deseja excluir a equipe? Essa ação não pode ser
        desfeita.
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              type="submit"
              onClick={() => handleSubmit(row.getValue('ID'))}
            >
              Excluir
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
