import Link from 'next/link';
import { ElementType } from 'react';

interface NavItemProps {
  link: string;
  title: string;
  icon: ElementType;
}

export function NavItem({ link, title, icon: Icon }: NavItemProps) {
  return (
    <Link
      href={link}
      className="group flex items-center gap-3 rounded px-3 py-2 hover:bg-emerald-50"
    >
      <Icon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-500 dark:text-zinc-400" />
      <span className="font-medium text-zinc-700 group-hover:text-emerald-500 dark:text-zinc-200">
        {title}
      </span>
    </Link>
  );
}
