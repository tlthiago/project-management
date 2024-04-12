'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { archiveProject } from '@/app/api/arquivados/archive-project';
import {
  getMemberByChapa,
  GetMemberByChapaResponse
} from '@/app/api/departments/get-member-by-chapa';
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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { UpdateProjectForm } from '../../components/update-project-form';
import { ProjectDetails } from './project-details';

export interface UpdateProjectFormProps {
  projectId: string;
}

export function ProjectProperties({ projectId }: UpdateProjectFormProps) {
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const chapa = session?.user.CHAPA ?? '';

  const router = useRouter();

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const { mutateAsync: archiveProjectFn } = useMutation({
    mutationFn: archiveProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.replace('/projetos');
    }
  });

  const managerUser =
    member?.FUNCAO === 'Administrador' || member?.FUNCAO === 'Coordenador';

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateProjectFormOpen, setIsUpdateProjectFormOpen] = useState(false);

  async function handleSubmit(projectId: string) {
    try {
      await archiveProjectFn({
        projectId: projectId,
        usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
      });

      toast.success('O projeto foi arquivado!');
    } catch {
      toast.error('Erro ao arquivar o projeto, contate o administrador.');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Abrir
            </DropdownMenuItem>
          </DialogTrigger>
          <ProjectDetails open={isDetailsOpen} projectId={projectId} />
        </Dialog>
        {managerUser && (
          <>
            <Dialog
              open={isUpdateProjectFormOpen}
              onOpenChange={setIsUpdateProjectFormOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <UpdateProjectForm
                open={isUpdateProjectFormOpen}
                projectId={projectId}
              />
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Arquivar
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
                    onClick={() => handleSubmit(projectId)}
                  >
                    Arquivar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
