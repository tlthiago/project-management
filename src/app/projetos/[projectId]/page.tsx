import { KanbanSquare, Table as TableIcon } from 'lucide-react';

import { TasksContainer } from '@/app/projetos/[projectId]/components/tasks-container';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TaskTableRow } from './components/task-table-row';
import { UserAvatar } from './components/user-avatar';

export default function Page({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-5 py-8">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Project: {params.projectId}
            </h1>
          </div>
          <div className="space-x-3">
            <Badge className="bg-zinc-200 text-zinc-500">Pendente</Badge>
            <Badge className="bg-green-200 text-green-500">Baixa</Badge>
            <span className="text-sm text-muted-foreground">
              16/01/2024 a 20/01/2024
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Progress className="h-2 w-96" value={33} />
            <span className="text-xs text-muted-foreground">33% completo</span>
          </div>
        </div>
        <div className="flex">
          <Avatar>
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>+2</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="space-y-3 px-5">
        <Tabs defaultValue="kanban">
          <TabsList className="space-x-2">
            <Button>Criar tarefa</Button>
            <TabsTrigger value="kanban">
              <KanbanSquare />
              <span>Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="table">
              <TableIcon />
              <span>Tabela</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="kanban">
            <div className="flex space-x-4">
              <TasksContainer borderColor="border-zinc-400" title="A fazer" />
              <TasksContainer
                borderColor="border-blue-400"
                title="Em andamento"
              />
              <TasksContainer
                borderColor="border-emerald-400"
                title="Finalizado"
              />
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Datas</TableHead>
                    <TableHead>Equipes</TableHead>
                    <TableHead>Responsáveis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => {
                    return <TaskTableRow key={i} />;
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
