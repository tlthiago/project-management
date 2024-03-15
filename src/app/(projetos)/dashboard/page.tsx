'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowUpRight,
  ArrowUpRightSquare,
  CheckCircle2,
  Circle,
  SquareStackIcon,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import {
  getLogsByDepartment,
  GetLogsByDepartmentResponse
} from '@/app/api/projetos/get-logs-by-department';
import {
  getProjectsByDepartment,
  GetProjectsByDepartmentResponse
} from '@/app/api/projetos/get-projects-by-department';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { columns } from './components/notifications/data-table/columns';
import { DataTable } from './components/notifications/data-table/data-table';
import ProjectShortcut from './components/project-shortcut';

export default function Dashboard() {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: projects = [] } = useQuery<GetProjectsByDepartmentResponse[]>({
    queryKey: ['projects', department],
    queryFn: () => getProjectsByDepartment({ department }),
    enabled: !!department
  });

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

  const { data: logs = [] } = useQuery<GetLogsByDepartmentResponse[]>({
    queryKey: ['logs', department],
    queryFn: () => getLogsByDepartment({ department }),
    enabled: !!department
  });

  const [tabsTrigger, setTabsTriggerValue] = useState(false);

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
              <CardHeader>
                <CardTitle>Visão geral</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">{/* <Overview /> */}</CardContent>
            </Card>
            <Card className="col-span-4 2xl:col-span-3">
              <CardHeader>
                <CardTitle>Criados recentemente</CardTitle>
                <CardDescription>
                  O seu time criou {projects?.length} projetos este mês.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {last5Projects.map((project) => {
                  return (
                    <ProjectShortcut
                      key={project.ID}
                      id={project.ID}
                      name={project.NOME}
                      teams={project.EQUIPES}
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
