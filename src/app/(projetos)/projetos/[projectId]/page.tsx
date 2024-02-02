'use client'

import { Kanban, MoreVertical, Plus, Star, Table } from 'lucide-react';

import { TaskContainer } from '@/app/(projetos)/projetos/[projectId]/components/kanban/task-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';

import { ProjectDetails } from '../components/project-details';
import { UsersAvatar } from '@/components/users-avatar';
import { CreateTaskForm } from './components/create-task-form';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/data-table';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';
import { useQuery } from '@tanstack/react-query';
import { GetTasksByProjectResponse, getTasksByProject } from '../../../api/projetos/get-tasks-by-project';
import Status from '@/components/status';
import Priority from '@/components/priority';
import { useState } from 'react';

export default function Project({
  params
}: {
  params: { projectId: string };
  
}) {
  const projectId: string = params.projectId;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!projectId
  })

  const { data: tasks = [] } = useQuery<GetTasksByProjectResponse[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject({ projectId }),
    enabled: !!projectId
  })

  const dataInicioString: string = project?.DATA_INICIO || '';
  const dataFimString: string = project?.DATA_FIM || '';

  const dataInicio = new Date(dataInicioString);
  const dataFim = new Date(dataFimString);
  
  return (
    <div className="space-y-3 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-7xl">
              {project?.NOME}
            </span>
            <div className='flex items-center'>
              <span className="text-sm">
                {dataInicio.toLocaleDateString('pt-BR')} a {dataFim.toLocaleDateString('pt-BR')}
              </span>
              <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <ProjectDetails open={isDetailsOpen} projectId={project?.ID} />
              </Dialog>
            </div>
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="line-clamp-1 max-w-6xl">
              {project?.DESCRICAO}
            </CardDescription>
            <div className='items-center space-y-1'>
              <span className='text-sm'>{project?.EQUIPES}</span>
              <div className='flex justify-between'>
                <Status status={project?.STATUS} />
                <Priority priority={project?.PRIORIDADE} />
                <UsersAvatar members={project?.RESPONSAVEIS} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <Tabs defaultValue="table">
            <div className="mx-5 flex items-start justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Nova tarefa</Button>
                </DialogTrigger>
                <CreateTaskForm
                  projectId={project?.ID}
                />
              </Dialog>
              <TabsList className="bg-muted">
                {/* <TabsTrigger value="kanban">
                  <Kanban />
                  <span className="ml-1">Kanban</span>
                </TabsTrigger> */}
                <TabsTrigger value="table">
                  <Table />
                  <span className="ml-1">Tabela</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="kanban" className="flex">
              <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" />
            </TabsContent>
              <TabsContent value="table" className="px-5">
              <DataTable
                columns={columns}
                data={tasks}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
