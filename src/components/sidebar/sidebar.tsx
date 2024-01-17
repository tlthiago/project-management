import {
  Archive,
  LayoutDashboard,
  PlusCircle,
  Settings,
  SquareStackIcon,
  Users
} from 'lucide-react';

import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { NavItem } from './nav-item';
import { Profile } from './profile';
import { ProjectItem } from './project-item';
import { ThemeToggle } from './theme-toggle';

export function Sidebar() {
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
        <NavItem link="#" title="Dashboard" icon={LayoutDashboard} />
        <NavItem link="/projetos" title="Projetos" icon={SquareStackIcon} />
        <NavItem link="#" title="Membros" icon={Users} />
        <NavItem link="#" title="Configurações" icon={Settings} />
      </nav>
      <Separator />
      <nav className="space-y-2">
        <div className="flex items-center">
          <span className="">Seus projetos</span>
          <PlusCircle className="ml-auto h-5 w-5 text-zinc-600 hover:cursor-pointer hover:text-zinc-800" />
        </div>
        <NavItem link="#" title="Arquivados" icon={Archive} />
        <ScrollArea className="h-96">
          <ProjectItem link="/projetos/1" title="Projeto 1" />
          <ProjectItem link="/projetos/2" title="Projeto 2" />
          <ProjectItem link="/projetos/3" title="Projeto 3" />
        </ScrollArea>
      </nav>
      <div className="mt-auto flex flex-col gap-6">
        <Profile />
      </div>
    </aside>
  );
}
