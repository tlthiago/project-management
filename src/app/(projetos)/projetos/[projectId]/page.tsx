'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  CircleDashed,
  PlayCircle,
  Share2,
  UserRound,
  UserRoundCog,
  UsersRound
} from 'lucide-react';
import { useState } from 'react';

// import { TaskContainer } from '@/app/(projetos)/projetos/[projectId]/components/kanban/task-container';
import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import Priority from '@/components/priority';
import Status from '@/components/status';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';
import { UsersAvatar } from '@/components/users-avatar';

import {
  getTasksByProject,
  GetTasksByProjectResponse
} from '../../../api/projetos/tarefas/get-tasks-by-project';
import { CreateTaskForm } from './components/create-task-form';
import { ProjectProperties } from './components/project-properties';
import { DataTableColumns } from './components/table/columns';
import { DataTable } from './components/table/data-table';

export default function Project({ params }: { params: { projectId: string } }) {
  const projectId: string = params.projectId;

  const [createTaskForm, setCreateTaskForm] = useState(false);

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  });

  const { data: tasks = [] } = useQuery<GetTasksByProjectResponse[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject({ projectId }),
    enabled: !!projectId
  });

  const dataInicioString: string | null = project?.DATA_INICIO || null;
  const dataFimString: string | null = project?.DATA_FIM || null;

  let dataInicio: Date = new Date();
  let dataFim: Date = new Date();

  if (dataInicioString !== null && dataFimString !== null) {
    dataInicio = new Date(dataInicioString);
    dataFim = new Date(dataFimString);
  }

  return (
    <div className="space-y-3">
      <Card className="grid grid-cols-4">
        <CardHeader className="col-span-3">
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-7xl">{project?.NOME}</span>
          </CardTitle>
          <CardDescription className="line-clamp-1 max-w-6xl">
            {project?.DESCRICAO}
          </CardDescription>
        </CardHeader>
        <div className="col-span-1 flex justify-end gap-2 p-4">
          <div className="space-y-2 text-sm">
            <div>
              Datas:{' '}
              {dataInicioString === null
                ? dataInicioString
                : `${dataInicio.toLocaleDateString('pt-BR')} a `}
              {dataFimString === null
                ? dataFimString
                : dataFim.toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <span>
                <Status status={project?.STATUS} />
              </span>
            </div>
            <div>
              Prioridade: <Priority priority={project?.PRIORIDADE} />
            </div>
            <div>Criado por: {project?.USU_INCLUSAO}</div>
            <div className="line-clamp-1">Equipes: {project?.EQUIPES}</div>
            <div className="flex items-center gap-1">
              <span>Membros:</span>
              <span>
                <UsersAvatar members={project?.MEMBROS} />
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" disabled>
              <Share2 className="size-5" />
            </Button>
            <div>
              <ProjectProperties projectId={projectId} />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <Tabs defaultValue="table">
            <div className="mx-5 flex items-start justify-between">
              <Dialog open={createTaskForm} onOpenChange={setCreateTaskForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    disabled={project?.STATUS === 'Finalizado'}
                  >
                    Criar tarefa
                  </Button>
                </DialogTrigger>
                <CreateTaskForm projectId={projectId} open={createTaskForm} />
              </Dialog>
              {/* <TabsList className="bg-muted">
                <TabsTrigger value="kanban">
                  <Kanban />
                  <span className="ml-1">Kanban</span>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Table />
                  <span className="ml-1">Tabela</span>
                </TabsTrigger>
              </TabsList> */}
            </div>
            <TabsContent value="kanban" className="flex">
              {/* <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" /> */}
            </TabsContent>
            <TabsContent value="table" className="px-5">
              <DataTable columns={DataTableColumns().columns} data={tasks} />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
