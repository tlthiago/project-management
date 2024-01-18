import {
  Kanban,
  MoreVertical,
  Plus,
  PlusCircle,
  Star,
  Table
} from 'lucide-react';

import { TasksContainer } from '@/app/projetos/[projectId]/components/tasks-container';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';

import { ProjectDetails } from '../components/project-details';
import TasksTable from './components/task-table';
import { UserAvatar } from './components/user-avatar';

export default function Page({ params }: { params: { projectId: string } }) {
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
                <DialogTrigger>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <ProjectDetails />
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span className="line-clamp-1 max-w-6xl">
              Desenvolvimento de Sistemas
            </span>
            <div className="flex gap-1">
              <UserAvatar userInitials="TA" />
              <UserAvatar userInitials="TA" />
              <UserAvatar userInitials="TA" />
              <UserAvatar userInitials="TA" />
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-muted text-xs">
                  <Plus className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="lg:h-[48rem]">
        <CardHeader>
          <Tabs defaultValue="kanban" className="">
            <div className="mx-5 flex items-start justify-between">
              <Button variant="secondary">Nova tarefa</Button>
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
            <TabsContent value="kanban">
              <div className="flex overflow-x-auto">
                <TasksContainer circleColor="bg-rose-400" title="ATRASADO" />
                <TasksContainer circleColor="bg-zinc-400" title="A FAZER" />
                <TasksContainer
                  circleColor="bg-blue-400"
                  title="EM ANDAMENTO"
                />
                <TasksContainer
                  circleColor="bg-emerald-400"
                  title="FINALIZADO"
                />
              </div>
            </TabsContent>
            <TabsContent value="table">
              <div>
                <TasksTable />
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
