import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ElementType } from 'react';

interface NavItemProps {
  link: string;
  title: string;
  icon: ElementType;
}

export function NavItem({ link, title, icon: Icon }: NavItemProps) {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      className={`flex items-center gap-3 rounded px-3 py-2 hover:border hover:border-neutral-50 ${pathname === link ? 'border border-neutral-50' : ''}`}
    >
      <Icon className="h-5 w-5 text-neutral-50" />
      <span className="text-sm font-medium text-neutral-50">{title}</span>
    </Link>
  );
}
