'use client';

import { useQuery } from '@tanstack/react-query';
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  SquareStackIcon,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import {
  getLogs,
  GetLogsResponse
} from '@/app/api/projetos/dashboard/get-logs';
import {
  getLogsByDepartment,
  GetLogsByDepartmentResponse
} from '@/app/api/projetos/dashboard/get-logs-by-department';
import { getAllProjects } from '@/app/api/projetos/get-all-projects';
import { getProjectsByDepartment } from '@/app/api/projetos/get-projects-by-department';
import { getProjectsByTeam } from '@/app/api/projetos/get-projects-by-team';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProjectsByStatusAndTeam } from './components/graphics/projects-by-status-by-team';
import { ProjectsByTeam } from './components/graphics/projects-by-team';
import { columns } from './components/notifications/data-table/columns';
import { DataTable } from './components/notifications/data-table/data-table';
import ProjectShortcut from './components/project-shortcut';

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

export default function Dashboard() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';
  const role = session?.user.FUNCAO ?? '';

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
  }

  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());

  const projectsCreatedThisMonth = projects.filter((project) => {
    const inclusionDate = parseISO(project.DATA_INCLUSAO);
    return isWithinInterval(inclusionDate, {
      start: startOfCurrentMonth,
      end: endOfCurrentMonth
    });
  }).length;

  const last5Projects = projects
    .slice()
    .sort(
      (a, b) =>
        new Date(b.DATA_INCLUSAO).getTime() -
        new Date(a.DATA_INCLUSAO).getTime()
    )
    .slice(0, 5);

  const delayedProjects = projects?.filter(
    (project) => project.ATRASADO === 'S'
  );
  const pendingProjects = projects?.filter(
    (project) => project.STATUS === 'Pendente'
  );
  const inProgressProjects = projects?.filter(
    (project) => project.STATUS === 'Em andamento'
  );
  const finishedProjects = projects?.filter(
    (project) => project.STATUS === 'Finalizado'
  );

  const teams: Team[] = projects.flatMap((project: Project) => project.EQUIPES);
  const teamsNames = teams.map((team) => team.NOME);

  const [tabsTrigger, setTabsTriggerValue] = useState(false);
  const [graphicsTabsTrigger, setGraphicsTabsTriggerValue] = useState(false);

  const { data: adminLogs = [] } = useQuery<GetLogsResponse[]>({
    queryKey: ['logs'],
    queryFn: () => getLogs(),
    enabled: !!role && role === 'Administrador' && !!tabsTrigger
  });

  const { data: managerLogs = [] } = useQuery<GetLogsByDepartmentResponse[]>({
    queryKey: ['logs-by-department', codDepartment],
    queryFn: () => getLogsByDepartment({ codDepartment }),
    enabled: !!codDepartment && !!role && role === 'Gerente' && !!tabsTrigger
  });

  const logs = role === 'Administrador' ? adminLogs : managerLogs;

  return (
    <div className="space-y-5">
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between">
          {!tabsTrigger ? (
            <h1 className="text-3xl font-bold tracking-tight">Visão geral</h1>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Notificações
              </h1>
              <p className="text-sm">Listando registros dos últimos 5 dias.</p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {/* <CalendarDateRangePicker /> */}
          </div>
          <div className="space-x-2">
            <Button disabled>Download</Button>
            <TabsList className="bg-neutral-200">
              <TabsTrigger
                value="overview"
                onClick={() => setTabsTriggerValue(false)}
              >
                Visão geral
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                onClick={() => setTabsTriggerValue(true)}
              >
                Notificações
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Link href="/projetos">
              <Card className="hover:border hover:border-neutral-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projetos criados
                  </CardTitle>
                  <SquareStackIcon className="size-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects?.length}</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projetos?filterParams=ATRASADO">
              <Card className="text-rose-500 hover:border hover:border-neutral-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Atrasados
                  </CardTitle>
                  <AlertCircle className="size-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold ">
                    {delayedProjects.length}
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projetos?filterParams=Pendente">
              <Card className="hover:border hover:border-neutral-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pendente
                  </CardTitle>
                  <Circle className="size-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingProjects.length}
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projetos?filterParams=Em andamento">
              <Card className="hover:border hover:border-neutral-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Em andamento
                  </CardTitle>
                  <Timer className="size-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inProgressProjects.length}
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projetos?filterParams=Finalizado">
              <Card className="hover:border hover:border-neutral-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Finalizados
                  </CardTitle>
                  <CheckCircle2 className="size-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {finishedProjects.length}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-4">
            <Card className="col-span-3 2xl:col-span-4">
              <Tabs defaultValue="1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {!graphicsTabsTrigger ? (
                      <CardTitle className="text-lg">
                        Quantidade de projetos por equipe
                      </CardTitle>
                    ) : (
                      <CardTitle className="text-lg">
                        Quantidade de projetos por status em cada equipe
                      </CardTitle>
                    )}
                    <TabsList>
                      <TabsTrigger
                        value="1"
                        onClick={() => setGraphicsTabsTriggerValue(false)}
                      >
                        Gráfico 1
                      </TabsTrigger>
                      <TabsTrigger
                        value="2"
                        onClick={() => setGraphicsTabsTriggerValue(true)}
                      >
                        Gráfico 2
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <TabsContent value="1">
                    <ProjectsByTeam />
                  </TabsContent>
                  <TabsContent value="2">
                    <ProjectsByStatusAndTeam />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
            <Card className="col-span-4 2xl:col-span-3">
              <CardHeader>
                <CardTitle>Criados recentemente</CardTitle>
                <CardDescription>
                  O seu time criou {projectsCreatedThisMonth} projetos este mês.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {last5Projects.map((project) => {
                  return (
                    <ProjectShortcut
                      key={project.ID}
                      id={project.ID}
                      name={project.NOME}
                      teams={teamsNames}
                      status={project.STATUS}
                      priority={project.PRIORIDADE}
                    />
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable columns={columns} data={logs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
