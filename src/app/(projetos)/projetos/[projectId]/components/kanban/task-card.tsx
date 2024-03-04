import { MessageCircleMore } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { UserAvatar } from '@/components/users-avatar';
import { TaskDetails } from '../task-details';
import { GetTaskByIdResponse, getTaskById } from '@/app/api/projetos/tarefas/get-task-by-id';
import { useQuery } from '@tanstack/react-query';

export interface TaskCardProps {
  projectId: string;
  taskId: string;
}

export function TaskCard({ projectId, taskId }: TaskCardProps) {
  const { data: task } = useQuery<GetTaskByIdResponse>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId })
  })

  return (
    <Dialog>
      <DialogTrigger>
        <Card className="w-full">
          <CardHeader className="text-left">
            <CardTitle className="line-clamp-1 text-base">
              {task?.NOME}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {task?.DESCRICAO}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between gap-2">
            <div className="flex">
              {/* <UserAvatar userInitials="TA" userName="Thiago Alves" /> */}
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">+2</AvatarFallback>
              </Avatar>
            </div>
            <Badge className="bg-rose-500 text-rose-50 hover:bg-rose-500/80">
              {task?.PRIORIDADE}
            </Badge>
            <div className="flex gap-0.5">
              <MessageCircleMore className="h-5 w-5" />
              <span className="text-xs">2</span>
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <TaskDetails projectId={projectId} taskId={taskId} />
    </Dialog>
  );
}
