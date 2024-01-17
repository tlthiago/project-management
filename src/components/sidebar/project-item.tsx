import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

interface ProjectItemsProps {
  title: string;
  link: string;
}

export function ProjectItem({ link, title }: ProjectItemsProps) {
  return (
    <div className="group flex w-full items-center gap-3 rounded px-3 hover:bg-emerald-100 dark:bg-transparent dark:hover:bg-emerald-100">
      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
      <Link href={link} className="py-3 group-hover:text-emerald-500">
        {title}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto group-hover:text-zinc-500">
          <MoreHorizontal className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Abrir</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuItem>Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
