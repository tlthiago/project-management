'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { unarchiveProject } from '@/app/api/arquivados/unarchive-project';
import { deleteProject } from '@/app/api/projetos/delete-project';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
  const { data: session } = useSession();
  const user = session?.user.CODUSUARIO ?? '';
  const role = session?.user.FUNCAO ?? '';
  const department = session?.user.SETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';

  const updateConditions =
    role === 'Administrador' ||
    role === 'Gerente' ||
    user === row.getValue('Criado por');

  const queryClient = useQueryClient();

  const { mutateAsync: unarchiveProjectFn } = useMutation({
    mutationFn: unarchiveProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['archived-projects'] });
      queryClient.invalidateQueries({
        queryKey: ['archived-projects-by-department', department]
      });
      queryClient.invalidateQueries({
        queryKey: ['archived-projects-by-team', chapa]
      });
    }
  });

  async function handleUnarchiveProject(projectId: string) {
    try {
      await unarchiveProjectFn({
        projectId: projectId,
        usuAtualizacao: session?.user.CODUSUARIO
          ? session.user.CODUSUARIO
          : 'MM_WEB'
      });

      toast.success('O projeto foi restaurado!');
    } catch {
      toast.error('Erro ao restaurar o projeto, contate o administrador.');
    }
  }

  const { mutateAsync: deleteProjectFn } = useMutation({
    mutationFn: deleteProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['archived-projects'] });
      queryClient.invalidateQueries({
        queryKey: ['archived-projects-by-department', department]
      });
      queryClient.invalidateQueries({
        queryKey: ['archived-projects-by-team', chapa]
      });
    }
  });

  async function handleSubmit(projectId: string) {
    try {
      await deleteProjectFn({
        projectId: projectId,
        usuAtualizacao: session?.user.CODUSUARIO
          ? session.user.CODUSUARIO
          : 'MM_WEB'
      });

      toast.success('O projeto foi excluído!');
    } catch {
      toast.error('Erro ao excluir o projeto, contate o administrador.');
    }
  }

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
        <DropdownMenuItem
          onClick={() => handleUnarchiveProject(row.getValue('ID'))}
          className={`${!updateConditions ? 'pointer-events-none opacity-50' : ''}`}
        >
          Restaurar
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className={`${!updateConditions ? 'pointer-events-none opacity-50' : ''}`}
              onSelect={(e) => e.preventDefault()}
            >
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Arquivar projeto</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja arquivar o projeto?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={() => handleSubmit(row.getValue('ID'))}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
