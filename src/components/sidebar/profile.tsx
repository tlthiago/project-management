'use client';

import { useQuery } from '@tanstack/react-query';
import { User, LogOut } from 'lucide-react';

import { getProfile } from '@/app/api/get-profile';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  return (
    <div className="grid grid-cols-profile items-center gap-3">
      <Avatar>
        <AvatarFallback className="bg-zinc-200 dark:bg-muted">
          <User className='text-muted-foreground' />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col truncate gap-1">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
          {isLoading ? <Skeleton className="h-4 w-36" /> : profile?.codUsuario}
        </span>
        <span className="truncate text-sm text-zinc-500 dark:text-zinc-100">
          {isLoading ? <Skeleton className="h-4 w-8" /> : profile?.nroEmpresa}
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
