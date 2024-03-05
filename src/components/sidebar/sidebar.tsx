'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Archive,
  LayoutDashboard,
  PlusCircle,
  SquareStackIcon,
  Users
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { CreateProjectForm } from '@/app/(projetos)/projetos/components/create-project-form';
import {
  getMemberByChapa,
  GetMemberByChapaResponse
} from '@/app/api/departments/get-member-by-chapa';
import {
  getProjectsByDepartment,
  GetProjectsByDepartmentResponse
} from '@/app/api/projetos/get-projects-by-department';
import {
  getProjectsByChapa,
  GetProjectsByChapaResponse
} from '@/app/api/projetos/get-projects-by-member';

import { Dialog, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { ProjectItem } from './project-item';
import { ThemeToggle } from './theme-toggle';

export function Sidebar() {
  const { data: session } = useSession();

  const department = session?.user.SETOR ?? '';

  const chapa = session?.user.CHAPA ?? '';

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const { data: adminProjects = [] } = useQuery<
    GetProjectsByDepartmentResponse[]
  >({
    queryKey: ['projects', department],
    queryFn: () => getProjectsByDepartment({ department }),
    enabled: !!department
  });

  const { data: memberProjects = [] } = useQuery<GetProjectsByChapaResponse[]>({
    queryKey: ['projects', chapa],
    queryFn: () => getProjectsByChapa({ chapa }),
    enabled: !!chapa
  });

  let projects = [];
  if (member?.FUNCAO === 'Administrador' && department) {
    projects = adminProjects;
  } else {
    projects = memberProjects;
  }

  return (
    <aside className="flex flex-col gap-6 border-r border-zinc-200 px-5 py-6">
      <div className="flex items-center">
        <div className="flex flex-col truncate">
          <h1>Mart Minas</h1>
          <span className="truncate pr-4 text-sm text-muted-foreground">
            {department.split('203 - ')}
          </span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <Separator />
      <nav>
        {member?.FUNCAO === 'Administrador' && (
          <>
            <NavItem
              link="/dashboard"
              title="Dashboard"
              icon={LayoutDashboard}
            />
            <NavItem link="/membros" title="Membros" icon={Users} />
          </>
        )}
        <NavItem link="/projetos" title="Projetos" icon={SquareStackIcon} />
      </nav>
      <Separator />
      <nav className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="">Seus projetos</span>
          {member?.FUNCAO === 'Administrador' && (
            <>
              <Dialog>
                <DialogTrigger>
                  <PlusCircle className="ml-auto h-5 w-5 text-zinc-600 hover:cursor-pointer hover:text-zinc-800" />
                </DialogTrigger>
                <CreateProjectForm />
              </Dialog>
            </>
          )}
        </div>
        {member?.FUNCAO === 'Administrador' && (
          <NavItem link="/arquivados" title="Arquivados" icon={Archive} />
        )}
        <ScrollArea className="rounded border xl:h-28 2xl:h-96">
          {projects &&
            projects.map((project) => {
              return (
                <ProjectItem
                  key={project.ID}
                  projectId={project.ID}
                  title={project.NOME}
                  link={`/projetos/${project.ID}`}
                />
              );
            })}
        </ScrollArea>
      </nav>
      <div className="flex flex-col gap-6">
        <Profile />
      </div>
    </aside>
  );
}
