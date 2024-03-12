'use client';

import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function Profile() {
  const { data: session } = useSession();

  const router = useRouter();

  async function logout() {
    await signOut({
      redirect: false
    });

    router.replace('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center gap-2 bg-transparent hover:bg-transparent dark:border-neutral-50"
        >
          <span className="text-xs font-semibold text-neutral-50">
            {session?.user.CODUSUARIO}
          </span>
          <span className="text-xs text-neutral-50">
            {session?.user.NROEMPRESA}
          </span>
          <ChevronDown className="size-4 text-neutral-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="flex cursor-pointer gap-2"
          onClick={logout}
        >
          <LogOut className="size-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
