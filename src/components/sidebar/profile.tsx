'use client';

import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';

import { getProfile } from '@/app/api/get-profile';

import { Avatar, AvatarFallback } from '../ui/avatar';

export function Profile() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  return (
    <div className="grid grid-cols-profile items-center gap-3">
      <Avatar>
        <AvatarFallback className="bg-zinc-200 dark:bg-muted">
          TA
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col truncate">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
          {profile?.codUsuario}
        </span>
        <span className="truncate text-sm text-zinc-500 dark:text-zinc-100">
          {profile?.nome}
        </span>
      </div>
      <button
        type="button"
        className="ml-auto rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-muted"
      >
        <LogOut className="h-5 w-5 text-zinc-500" />
      </button>
    </div>
  );
}
