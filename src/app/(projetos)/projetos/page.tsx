'use client';

import { useQuery } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { CreateProjectForm } from './components/create-project-form';
import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';

export default function Projects() {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';

  let projects: any = [];

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  if (member?.FUNCAO === 'Administrador' && department) {
    const { data: adminProjects = [] } = useQuery<
      GetProjectsByDepartmentResponse[]
    >({
      queryKey: ['projects', department],
      queryFn: () => getProjectsByDepartment({ department }),
      enabled: !!department
    });
    projects = adminProjects;
  } else {
    const { data: memberProjects = [] } = useQuery<
      GetProjectsByChapaResponse[]
    >({
      queryKey: ['projects', chapa],
      queryFn: () => getProjectsByChapa({ chapa }),
      enabled: !!chapa
    });
    projects = memberProjects;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        {member?.FUNCAO === 'Administrador' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Criar projeto</Button>
            </DialogTrigger>
            <CreateProjectForm />
          </Dialog>
        )}
      </div>
      <Card>
        <CardContent className="pt-5">
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
