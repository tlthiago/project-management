import { useMutation, useQuery } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UpdateProjectForm } from '@/app/(projetos)/projetos/components/update-project-form';
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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { queryClient } from '@/lib/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

interface ProjectItemsProps {
  projectId: number;
  title: string;
  link: string;
}

export function ProjectItem({ projectId, link, title }: ProjectItemsProps) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const projectIdString = projectId.toString();

  const router = useRouter();
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameId = pathnameParts.pop();

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { mutateAsync: archiveProjectFn } = useMutation({
    mutationFn: archiveProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects', department] });
      queryClient.invalidateQueries({ queryKey: ['projects', chapa] });
      queryClient.invalidateQueries({ queryKey: ['archived-projects'] });

      if (pathnameId && pathnameId === projectIdString) {
        router.replace('/projetos');
      }
    }
  });

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
    <div className="group flex w-full items-center gap-3 rounded px-3 hover:bg-emerald-100 dark:bg-transparent dark:hover:bg-emerald-100">
      <Link href={link} className="py-3 group-hover:text-emerald-500">
        {title}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto group-hover:text-zinc-500">
          <MoreHorizontal className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={link}>
            <DropdownMenuItem>Abrir</DropdownMenuItem>
          </Link>
          {member?.FUNCAO === 'Administrador' && (
            <>
              <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Editar
                  </DropdownMenuItem>
                </DialogTrigger>
                <UpdateProjectForm
                  open={isDetailsOpen}
                  projectId={projectIdString}
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
                      onClick={() => handleSubmit(projectIdString)}
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
    </div>
  );
}
