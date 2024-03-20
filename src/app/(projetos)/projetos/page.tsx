'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import {
  getMemberByChapa,
  GetMemberByChapaResponse
} from '@/app/api/departments/get-member-by-chapa';
import {
  getProjectsByDepartment,
  GetProjectsByDepartmentResponse
} from '@/app/api/projetos/get-projects-by-department';
import {
  getProjectsByChapa,
  GetProjectsByChapaResponse
} from '@/app/api/projetos/get-projects-by-member';
import {
  getProjectsByTeam,
  GetProjectsByTeamResponse
} from '@/app/api/projetos/get-projects-by-team';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { CreateProjectForm } from './components/create-project-form';
import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';

export default function Projects() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const { data: adminProjects = [] } = useQuery<
    GetProjectsByDepartmentResponse[]
  >({
    queryKey: ['projects', department],
    queryFn: () => getProjectsByDepartment({ department }),
    enabled: !!department
  });

  const { data: coordinatorProjects = [] } = useQuery<
    GetProjectsByTeamResponse[]
  >({
    queryKey: ['coordinator-projects', chapa],
    queryFn: () => getProjectsByTeam({ department, chapa }),
    enabled: !!chapa
  });

  const { data: memberProjects = [] } = useQuery<GetProjectsByChapaResponse[]>({
    queryKey: ['member-projects', chapa],
    queryFn: () => getProjectsByChapa({ chapa }),
    enabled: !!chapa
  });

  let projects = [];
  if (member?.FUNCAO === 'Administrador' && department) {
    projects = adminProjects;
  } else if (member?.FUNCAO === 'Coordenador' && department) {
    projects = coordinatorProjects;
  } else {
    projects = memberProjects;
  }

  const filterParams: string | null = searchParams.get('filterParams');

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        {member?.FUNCAO === 'Administrador' ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Criar projeto</Button>
            </DialogTrigger>
            <CreateProjectForm />
          </Dialog>
        ) : member?.FUNCAO === 'Coordenador' ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Criar projeto</Button>
            </DialogTrigger>
            <CreateProjectForm />
          </Dialog>
        ) : null}
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={projects}
            filterParams={filterParams}
          />
        </CardContent>
      </Card>
    </div>
  );
}
