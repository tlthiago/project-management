'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';
import { useQuery } from '@tanstack/react-query';
import { getArchivedProjects, GetArchivedProjectsResponse } from '@/app/api/projetos/get-archived-projects';
import { useSession } from 'next-auth/react';

export default function Archived() {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: archivedProjects = [] } = useQuery<GetArchivedProjectsResponse[]>({
    queryKey: ['archived-projects'],
    queryFn: () => getArchivedProjects({ department }),
    enabled: !!department
  });
  
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Arquivados</h1>
      <Card>
        <CardContent className="pt-5">
          <DataTable columns={columns} data={archivedProjects} />
        </CardContent>
      </Card>
    </div>
  );
}
