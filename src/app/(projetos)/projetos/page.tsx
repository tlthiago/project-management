'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { getAllProjects } from '@/app/api/projetos/get-all-projects';
import { getProjectsByChapa } from '@/app/api/projetos/get-projects-by-chapa';
import { getProjectsByDepartment } from '@/app/api/projetos/get-projects-by-department';
import { getProjectsByTeam } from '@/app/api/projetos/get-projects-by-team';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { CreateProjectForm } from './components/create-project-form';
import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  MEMBROS: Member[];
}

interface Project {
  ID: number;
  NOME: string;
  DATA_INICIO: string;
  DATA_FIM: string;
  DESCRICAO: string;
  DEPARTAMENTO: string;
  STATUS: string;
  PRIORIDADE: string;
  USU_INCLUSAO: string;
  DATA_INCLUSAO: string;
  ATRASADO: string;
  EQUIPES: Team[];
}

export default function Projects() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: adminProjects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => getAllProjects(),
    enabled: !!role && role === 'Administrador'
  });

  const { data: managerProjects = [] } = useQuery<Project[]>({
    queryKey: ['projects-by-department', codDepartment],
    queryFn: () => getProjectsByDepartment({ codDepartment }),
    enabled: !!codDepartment && !!role && role === 'Gerente'
  });

  const { data: leaderProjects = [] } = useQuery<Project[]>({
    queryKey: ['projects-by-team', chapa],
    queryFn: () => getProjectsByTeam({ codDepartment, chapa }),
    enabled: !!codDepartment && !!chapa && !!role && role === 'Coordenador'
  });

  const { data: memberProjects = [] } = useQuery<Project[]>({
    queryKey: ['member-projects', chapa],
    queryFn: () => getProjectsByChapa({ chapa }),
    enabled: !!chapa && !!role && role === 'Membro'
  });

  let projects: Project[] = [];

  switch (role) {
    case 'Administrador':
      projects = adminProjects;
      break;
    case 'Gerente':
      if (codDepartment) {
        projects = managerProjects;
      }
      break;
    case 'Coordenador':
      if (codDepartment && chapa) {
        projects = leaderProjects;
      }
      break;
    case 'Membro':
      if (chapa) {
        projects = memberProjects;
      }
      break;
    default:
      projects = memberProjects;
  }

  const filterParams: string | null = searchParams.get('filterParams');

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        {role !== 'Membro' && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="default">Criar projeto</Button>
            </DialogTrigger>
            <CreateProjectForm open={isCreateDialogOpen} />
          </Dialog>
        )}
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
