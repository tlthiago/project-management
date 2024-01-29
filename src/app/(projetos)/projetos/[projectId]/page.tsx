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

import { Task } from '../../api/data/schema';
import { ProjectDetails } from '../components/project-details';
import { UserAvatar } from '@/components/user-avatar';
import { CreateTaskForm } from './components/create-task-form';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/data-table';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';
import { useQuery } from '@tanstack/react-query';

export default function Project({
  params
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId })
  })

  console.log(project);

  return (
    <div className="space-y-3 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-7xl">
              {project?.NOME}
            </span>
            <div>
              {/* <Button variant="ghost" size="icon">
                <Star className="h-5 w-5" />
              </Button> */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <ProjectDetails projectId={project?.ID} />
              </Dialog>
            </div>
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="line-clamp-1 max-w-6xl">
              {project?.DESCRICAO}
            </CardDescription>
            <div className="flex gap-1">
              {project?.RESPONSAVEIS}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <Tabs defaultValue="kanban">
            <div className="mx-5 flex items-start justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Nova tarefa</Button>
                </DialogTrigger>
                {/* <CreateTaskForm
                  projectId={project?.ID}
                  projectTeams={project?.RESPONSAVEIS}
                /> */}
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
            {/* <TabsContent value="kanban" className="flex">
              <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" />
            </TabsContent> */}
            {/* <TabsContent value="table" className="px-5">
              <DataTable
                columns={columns}
                data={tasks}
                projectId={params.projectId}
                projectTeams={}
              />
            </TabsContent> */}
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
