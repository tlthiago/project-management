'use client'

import {
  Archive,
  LayoutDashboard,
  PlusCircle,
  Settings,
  SquareStackIcon,
  Users
} from 'lucide-react';

import { CreateProjectForm } from '@/app/(projetos)/projetos/components/create-project-form';

import { Dialog, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { ProjectItem } from './project-item';
import { ThemeToggle } from './theme-toggle';

import { useQuery } from '@tanstack/react-query';

import { GetProjectsResponse, getProjects } from '@/app/api/projetos/get-projects';

export function Sidebar() {
  const { data: projects = [] } = useQuery<GetProjectsResponse[]>({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  return (
    <aside className="flex flex-col gap-6 border-r border-zinc-200 px-5 py-8">
      <div className="flex items-center">
        <div className="flex flex-col truncate">
          <h1>Mart Minas</h1>
          <span className="truncate pr-4 text-sm text-muted-foreground">
            Tecnologia da Informação
          </span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <Separator />
      <nav>
        <NavItem link="/dashboard" title="Dashboard" icon={LayoutDashboard} />
        <NavItem link="/projetos" title="Projetos" icon={SquareStackIcon} />
        <NavItem link="/membros" title="Membros" icon={Users} />
        <NavItem link="#" title="Configurações" icon={Settings} />
      </nav>
      <Separator />
      <nav className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="">Seus projetos</span>
          <Dialog>
            <DialogTrigger>
              <PlusCircle className="ml-auto h-5 w-5 text-zinc-600 hover:cursor-pointer hover:text-zinc-800" />
            </DialogTrigger>
            <CreateProjectForm />
          </Dialog>
        </div>
        <NavItem link="/arquivados" title="Arquivados" icon={Archive} />
        <ScrollArea className="rounded border xl:h-28 2xl:h-96">
          {projects && projects.map(project => {
            return <ProjectItem key={project.ID} title={project.NOME} link={`/projetos/${project.ID}`} />
          })}
        </ScrollArea>
      </nav>
      <div className="mt-auto flex flex-col gap-6">
        <Profile />
      </div>
    </aside>
  );
}
