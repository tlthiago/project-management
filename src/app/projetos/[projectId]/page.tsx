import { Kanban, MoreVertical, Plus, Star, Table } from 'lucide-react';

import { TaskContainer } from '@/app/projetos/[projectId]/components/kanban/task-container';
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
import { CreateTaskForm } from './components/create-task-form';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/data-table';
import { UserAvatar } from './components/user-avatar';

async function getData(): Promise<Task[]> {
  return [
    {
      id: '1',
      projectId: '1',
      name: 'Tarefa 1',
      // dateRange: {
      //   from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Thiago Alves', 'Paulo Gonçalves'],
      status: 'todo',
      priority: 'low'
    },
    {
      id: '2',
      projectId: '1',
      name: 'Tarefa 2',
      // dateRange: {
      //   from: 'Tue Jan 2 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 8 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Pedro Bomfim', 'Dantom Rodrigues'],
      status: 'in progress',
      priority: 'medium'
    },
    {
      id: '3',
      projectId: '1',
      name: 'Tarefa 3',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'done',
      priority: 'high'
    },
    {
      id: '4',
      projectId: '1',
      name: 'Tarefa 4',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'backlog',
      priority: 'low'
    },
    {
      id: '5',
      projectId: '1',
      name: 'Tarefa 5',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'done',
      priority: 'medium'
    },
    {
      id: '6',
      projectId: '1',
      name: 'Tarefa 6',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'todo',
      priority: 'high'
    },
    {
      id: '7',
      projectId: '1',
      name: 'Tarefa 7',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'todo',
      priority: 'medium'
    },
    {
      id: '8',
      projectId: '1',
      name: 'Tarefa 8',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'in progress',
      priority: 'low'
    },
    {
      id: '9',
      projectId: '1',
      name: 'Tarefa 9',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'done',
      priority: 'low'
    },
    {
      id: '10',
      projectId: '1',
      name: 'Tarefa 10',
      // dateRange: {
      //   from: 'Tue Jan 13 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
      //   to: 'Tue Jan 22 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      // },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'backlog',
      priority: 'high'
    }
  ];
}

export default async function Page({
  params
}: {
  params: { projectId: string };
}) {
  const data = await getData();
  const teamsList = ['Desenvolvimento de Sistemas'];

  return (
    <div className="space-y-3 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-7xl">
              Projeto {params.projectId}
            </span>
            <div>
              <Button variant="ghost" size="icon">
                <Star className="h-5 w-5" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <ProjectDetails projectId={params.projectId} />
              </Dialog>
            </div>
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="line-clamp-1 max-w-6xl">
              Desenvolvimento de Sistemas
            </CardDescription>
            <div className="flex gap-1">
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
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
                <CreateTaskForm
                  projectId={params.projectId}
                  projectTeams={teamsList}
                />
              </Dialog>
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
            <TabsContent value="kanban" className="flex">
              <TaskContainer title="ATRASADO" />
              <TaskContainer title="PENDENTE" />
              <TaskContainer title="EM PROGRESSO" />
              <TaskContainer title="FINALIZADO" />
            </TabsContent>
            <TabsContent value="table" className="px-5">
              <DataTable columns={columns} data={data} />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
