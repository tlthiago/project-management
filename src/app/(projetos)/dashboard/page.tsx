'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  SquareStackIcon,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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

  return (
    <div className="space-y-5">
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {/* <CalendarDateRangePicker /> */}
          </div>
          <div className="space-x-2">
            <Button>Download</Button>
            <TabsList>
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notificações
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
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
            <Link href="/projetos">
              <Card className="text-rose-500">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                <Circle className="size-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingProjects.length}
                </div>
              </CardContent>
            </Card>
            <Card>
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
            <Card>
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
                  O seu time já criou {projects?.length} projetos.
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
      </Tabs>
    </div>
  );
}
