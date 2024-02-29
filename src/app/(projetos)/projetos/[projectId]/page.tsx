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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetTasksByProjectResponse, getTasksByProject } from '../../../api/projetos/get-tasks-by-project';
import Status from '@/components/status';
import Priority from '@/components/priority';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetMemberByChapaResponse, getMemberByChapa } from '@/app/api/departments/get-member-by-chapa';

export default function Project({
  params
}: {
  params: { projectId: string };
}) {
  const { data: session } = useSession();
  const chapa = session?.user.CHAPA ?? '';
  
  const projectId: string = params.projectId;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const queryClient = useQueryClient();

  if (tasks) {
    let verificado: boolean = false;

    if (tasks.some((task: GetTasksByProjectResponse) => task.STATUS !== "Pendente") && !verificado) {
      verificado = true;
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }

    if (tasks.every((task: GetTasksByProjectResponse) => task.STATUS === "Finalizado")) {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  }

  const dataInicioString: string = project?.DATA_INICIO || '';
  const dataFimString: string = project?.DATA_FIM || '';

  const dataInicio = new Date(dataInicioString);
  const dataFim = new Date(dataFimString);
  
  return (
    <div className="space-y-3">
      <Card className='grid grid-cols-4'>
        <CardHeader className='col-span-3'>
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-7xl">
              {project?.NOME}
            </span>
          </CardTitle>
          <CardDescription className="line-clamp-1 max-w-6xl">
            {project?.DESCRICAO}
          </CardDescription>
        </CardHeader>
        <div className='col-span-1 p-4 flex justify-end gap-2'>
          <div className='space-y-2 text-sm'>
            <div>Datas: {dataInicio.toLocaleDateString('pt-BR')} a {dataFim.toLocaleDateString('pt-BR')}</div>
            <div className='flex gap-1'>
              <span>Status:</span>
              <Status status={project?.STATUS} />
            </div>
            <div>
              <span>Prioridade: </span>
              <Priority priority={project?.PRIORIDADE} />
            </div>
            <div className='line-clamp-1'>Equipes: {project?.EQUIPES}</div>
            <div className='flex items-center gap-1'>
              <span>Membros:</span>
              <UsersAvatar members={project?.RESPONSAVEIS} />
            </div>
          </div>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <ProjectDetails open={isDetailsOpen} projectId={project?.ID} />
          </Dialog>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <Tabs defaultValue="table">
            <div className="mx-5 flex items-start justify-between">
              {member?.FUNCAO === 'Administrador' && 
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">Criar tarefa</Button>
                    </DialogTrigger>
                    <CreateTaskForm
                      projectId={projectId}
                    />
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
                </>
              }
            </div>
            <TabsContent value="kanban" className="flex">
              <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" />
            </TabsContent>
              <TabsContent value="table" className="px-5">
              <DataTable columns={columns} data={tasks} />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
