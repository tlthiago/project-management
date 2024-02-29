'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { archiveProject } from '@/app/api/projetos/archive-project';
import { UpdateProjectForm } from '../update-project-form';
import { useSession } from 'next-auth/react';
import { GetMemberByChapaResponse, getMemberByChapa } from '@/app/api/departments/get-member-by-chapa';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient();
  
  const { data: session } = useSession();
  const chapa = session?.user.CHAPA ?? '';

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const { mutateAsync: archiveProjectFn } = useMutation({
    mutationFn: archiveProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  async function handleSubmit(projectId: string) {
    try {
      await archiveProjectFn({
        projectId: projectId
      })
      
      toast.success('O projeto foi arquivado!');
    } catch {
      toast.error('Erro ao arquivar o projeto, contate o administrador.');
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
        <Link href={`projetos/${row.getValue('ID')}`}>
          <DropdownMenuItem>Abrir</DropdownMenuItem>
        </Link>
        {member?.FUNCAO === 'Administrador' && 
          <>
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <UpdateProjectForm open={isDetailsOpen} projectId={row.getValue('ID')} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Arquivar
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Arquivar projeto</DialogTitle>
                </DialogHeader>
                Tem certeza que deseja arquivar o projeto?
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" type="submit" onClick={() => handleSubmit(row.getValue('ID'))}>
                      Arquivar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
