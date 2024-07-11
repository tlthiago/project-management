'use client';

import { Archive, LayoutDashboard, SquareStackIcon, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { ThemeToggle } from '@/components/sidebar/theme-toggle';

import { NavItem } from '../sidebar/nav-item';
import { Profile } from './profile';

export function Navbar() {
  const { data: session } = useSession();
  const role = session?.user.FUNCAO ?? '';

  return (
    <nav className="border-b border-gray-200 bg-gradient-to-r from-[#00A451] to-[#052846] dark:border-zinc-900 dark:bg-zinc-950">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            {/* <Sidebar /> */}
            <nav className="flex gap-2">
              {(role === 'Administrador' || role === 'Gerente') && (
                <>
                  <NavItem
                    link="/dashboard"
                    title="Dashboard"
                    icon={LayoutDashboard}
                  />
                  <NavItem link="/membros" title="Membros" icon={Users} />
                </>
              )}
              <NavItem
                link="/projetos"
                title="Projetos"
                icon={SquareStackIcon}
              />
              {role !== 'Membro' && (
                <NavItem link="/arquivados" title="Arquivados" icon={Archive} />
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
}
