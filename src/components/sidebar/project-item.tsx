import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
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
import { useSession } from 'next-auth/react';
import { GetMemberByChapaResponse, getMemberByChapa } from '@/app/api/departments/get-member-by-chapa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpdateProjectForm } from '@/app/(projetos)/projetos/components/update-project-form';
import { toast } from 'sonner';
import { archiveProject } from '@/app/api/projetos/archive-project';
import { useState } from 'react';
import { queryClient } from '@/lib/react-query';

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
    }
  });

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
          {member?.FUNCAO === 'Administrador' && 
          <>
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <UpdateProjectForm open={isDetailsOpen} projectId={projectIdString} />
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
                    <Button variant="destructive" type="submit" onClick={() => handleSubmit(projectIdString)}>
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
    </div>
  );
}
