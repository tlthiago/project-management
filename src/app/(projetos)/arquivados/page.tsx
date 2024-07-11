'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { getAllArchivedProjects } from '@/app/api/arquivados/get-all-archived-projects';
import { getArchivedProjectsByDepartment } from '@/app/api/arquivados/get-archived-projects-by-department';
import { getArchivedProjectsByTeam } from '@/app/api/arquivados/get-archived-projects-by-team';
import { Card, CardContent } from '@/components/ui/card';

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

export default function Archived() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

  const { data: adminProjects = [] } = useQuery<Project[]>({
    queryKey: ['archived-projects'],
    queryFn: () => getAllArchivedProjects(),
    enabled: !!role && role === 'Administrador'
  });

  const { data: managerProjects = [] } = useQuery<Project[]>({
    queryKey: ['archived-projects-by-department', codDepartment],
    queryFn: () => getArchivedProjectsByDepartment({ codDepartment }),
    enabled: !!codDepartment && !!role && role === 'Gerente'
  });

  const { data: coordinatorProjects = [] } = useQuery<Project[]>({
    queryKey: ['archived-projects-by-team', chapa],
    queryFn: () => getArchivedProjectsByTeam({ codDepartment, chapa }),
    enabled: !!codDepartment && !!chapa && !!role && role === 'Coordenador'
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
        projects = coordinatorProjects;
      }
      break;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Arquivados</h1>
      <Card>
        <CardContent className="pt-5">
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
