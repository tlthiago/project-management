'use client';

import { useQuery } from '@tanstack/react-query';
import { isEqual, startOfDay } from 'date-fns';
import {
  // Activity,
  // CalendarCheck,
  CalendarDays,
  CircleDashed,
  PlayCircle,
  Share2,
  UserRound,
  // UserRoundCog,
  UsersRound
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

// import { TaskContainer } from '@/app/(projetos)/projetos/[projectId]/components/kanban/task-container';
import {
  getProjectById,
  GetProjectByIdResponse,
  Tasks
} from '@/app/api/projetos/get-project-by-id';
import Priority from '@/components/priority';
import Status from '@/components/status';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
// import { Progress } from '@/components/ui/progress';
// import { TabsContent } from '@/components/ui/tabs';
// import { Tabs } from '@/components/ui/tabs';
import { UsersAvatar } from '@/components/users-avatar';

import { ProjectProperties } from './components/project-properties';
import { ShareProject } from './components/share-project';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/data-table';

interface Member {
  CHAPA: string;
  NOME: string;
}

export default function Project({ params }: { params: { projectId: string } }) {
  const projectId: number = parseInt(params.projectId);
  const { data: session } = useSession();
  const role = session?.user.FUNCAO ?? '';

  const [formShareOpen, setFormShareOpen] = useState(false);

  const {
    data: project,
    isLoading,
    isError
  } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError || !project) {
    return (
      <div>Ocorreu um erro ao carregar o projeto. Contate o administrador.</div>
    );
  }

  const dataInicio: Date | null = project.DATA_INICIO
    ? new Date(project.DATA_INICIO)
    : null;
  const dataFim: Date | null = project.DATA_FIM
    ? new Date(project?.DATA_FIM)
    : null;

  const today = new Date();

  const teamsNames = project.EQUIPES.map((teams) => teams.NOME);

  const members: Member[] =
    project.EQUIPES.flatMap((team) =>
      team.MEMBROS.map((member) => ({
        CHAPA: member.CHAPA,
        NOME: member.NOME
      }))
    ) || [];

  const tasks: Tasks[] = project.TAREFAS.map((tarefa) => tarefa);

  const limite: boolean = dataFim
    ? isEqual(startOfDay(dataFim), startOfDay(today))
    : false;

  // const totalTasks = tasks.length;
  // let completedTasks = 0;
  // let progress = 0;

  // for (const task of tasks) {
  //   if (task.STATUS === 'Finalizado') {
  //     completedTasks++;
  //   }
  // }

  // progress = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="line-clamp-1">{project.NOME}</span>
            </CardTitle>
            <div className="flex gap-2">
              {role !== 'Membro' && (
                <Popover open={formShareOpen} onOpenChange={setFormShareOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Share2 className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <ShareProject
                    open={formShareOpen}
                    projectId={projectId}
                    currentMembers={members}
                    onClose={() => setFormShareOpen(false)}
                  />
                </Popover>
              )}
              <div>
                <ProjectProperties
                  projectId={project.ID}
                  projectOwner={project.USU_INCLUSAO}
                />
              </div>
            </div>
          </div>
          {project.DESCRICAO && (
            <CardDescription className="line-clamp-1 max-w-6xl">
              {project.DESCRICAO}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex items-center gap-8 text-sm">
          {limite && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              <span className="font-semibold text-amber-500">Data limite</span>
            </div>
          )}
          {project?.ATRASADO === 'S' && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              <span className="font-semibold text-red-500">Atrasado</span>
            </div>
          )}
          {dataInicio && dataFim && (
            <div className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              <span>
                Datas:{' '}
                {dataInicio !== null &&
                  `${dataInicio.toLocaleDateString('pt-BR')} a `}
                {dataFim !== null && dataFim.toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CircleDashed className="size-4" />
            <span>Status:</span>
            <span>
              <Status status={project.STATUS} />
            </span>
          </div>
          <div className="flex items-center gap-1">
            <PlayCircle className="size-4 rotate-90" />
            <span>Prioridade:</span>
            <Priority priority={project.PRIORIDADE} />
          </div>
          {/* <div className="flex items-center gap-1">
            <UserRoundCog className="size-4" />
            <span>Criado por:</span>
            {project?.USU_INCLUSAO}
          </div> */}
          <div className="flex items-center gap-1">
            <UsersRound className="size-4" />
            <span>Equipes:</span>
            <span className="line-clamp-1 w-32">{teamsNames}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserRound className="size-4" />
            <span>Membros:</span>
            <span>
              <UsersAvatar members={members} />
            </span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Activity className="size-4" />
            <span>Progresso:</span>
            <Progress value={progress} className="h-1 w-32" />
            <span>{progress.toFixed(0)}%</span>
          </div> */}
          {/* <div className="flex items-center gap-1">
            <CalendarCheck className="size-4" />
            <span>Finalizado em:</span>
            <span>07/05/2024</span>
          </div> */}
        </CardContent>
      </Card>
      <Card>
        {/* <CardHeader>
          <Tabs defaultValue="table">
            <div className="flex items-start justify-between">
              <TabsList className="bg-muted">
                <TabsTrigger value="kanban">
                  <Kanban />
                  <span className="ml-1">Kanban</span>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Table />
                  <span className="ml-1">Tabela</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader> */}
        <CardContent className="pt-6">
          {/* <TabsContent value="kanban" className="flex">
              <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" />
            </TabsContent>
            <TabsContent value="table" className="px-5">
            </TabsContent> */}
          <DataTable columns={columns} data={tasks} />
        </CardContent>
      </Card>
    </div>
  );
}
