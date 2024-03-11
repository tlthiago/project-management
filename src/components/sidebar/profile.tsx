'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { Avatar, AvatarFallback } from '../ui/avatar';

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
    <div className="grid grid-cols-profile items-center gap-3">
      <Avatar>
        <AvatarFallback className="bg-zinc-200 dark:bg-muted">
          <User className="text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1 truncate">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
          {session?.user.CODUSUARIO}
        </span>
        <span className="truncate text-sm text-zinc-500 dark:text-zinc-100">
          {session?.user.NROEMPRESA}
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="ml-auto rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-muted"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 text-zinc-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sair</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
