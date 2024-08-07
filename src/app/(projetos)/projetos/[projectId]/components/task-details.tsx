import { useQuery } from '@tanstack/react-query';

import {
  getTaskById,
  GetTaskByIdResponse,
  Member
} from '@/app/api/projetos/tarefas/get-task-by-id';
import Priority from '@/components/priority';
import Status from '@/components/status';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersAvatar } from '@/components/users-avatar';

import { TaskComment } from './task-comment';

interface TaskDetailsProps {
  taskId: number;
  open: boolean;
}

export function TaskDetails({ taskId, open }: TaskDetailsProps) {
  const { data: task } = useQuery<GetTaskByIdResponse>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ taskId }),
    enabled: !!open
  });

  const dataInicioString: string | null = task?.DATA_INICIO || null;
  const dataFimString: string | null = task?.DATA_FIM || null;

  let dataInicio: Date = new Date();
  let dataFim: Date = new Date();

  if (dataInicioString !== null && dataFimString !== null) {
    dataInicio = new Date(dataInicioString);
    dataFim = new Date(dataFimString);
  }

  const members: Member[] = task?.RESPONSAVEIS || [];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{task?.NOME}</DialogTitle>
      </DialogHeader>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Status</TableCell>
            <TableCell className="flex justify-end">
              <Status status={task?.STATUS} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Prioridade</TableCell>
            <TableCell className="flex justify-end">
              <div className="flex items-center gap-2">
                <Priority priority={task?.PRIORIDADE} />
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Datas</TableCell>
            <TableCell className="text-right">
              <span>
                {dataInicioString === null
                  ? dataInicioString
                  : `${dataInicio.toLocaleDateString('pt-BR')} a `}
                {dataFimString === null
                  ? dataFimString
                  : dataFim.toLocaleDateString('pt-BR')}
              </span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">
              Responsáveis
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <UsersAvatar members={members} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Tabs defaultValue="description">
        <div className="bg-muted">
          <TabsList>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger disabled value="comments">
              Comentários
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="description"
          className="mt-0 p-4 align-middle text-sm hover:bg-muted/50"
        >
          {task?.DESCRICAO}
        </TabsContent>
        <TabsContent value="comments" className="mt-0">
          <ScrollArea className="h-56 p-4 align-middle">
            <div className="space-y-3">
              <TaskComment />
              <TaskComment />
              <TaskComment />
            </div>
          </ScrollArea>
          <div className="flex items-center gap-3">
            {/* <UserAvatar userInitials="TA" userName="Thiago Alves" /> */}
            <Input placeholder="Adicione um comentário..." />
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
