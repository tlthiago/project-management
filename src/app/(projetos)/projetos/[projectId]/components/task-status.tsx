import { GetMemberByChapaResponse, getMemberByChapa } from "@/app/api/departments/get-member-by-chapa";
import Status from "@/components/status";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { HelpCircle, Circle, Timer, CheckCircle2, ChevronRight } from "lucide-react";
import { UpdateTaskStatus } from "@/app/api/projetos/tarefas/update-task-status";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

interface TaskStatusProps {
  projectId: number;
  taskId: number;
  status: string;
}

export default function TaskStatus({ projectId, taskId, status }: TaskStatusProps) {
  const { data: session } = useSession();
  const chapa = session?.user.CHAPA ?? '';

  const projectIdString = projectId.toString();

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });
  
  const handleStatusChange = async (status: string) => {
    switch (status) {
      case 'Atrasado':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: status
        });
        break;
      case 'Pendente':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: status
        });
        break;
      case 'Em andamento':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: status
        });
        break;
      case 'Finalizado':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: status
        });
        break;
    }
  }

  const updateTaskStatus = async (status: string) => {
    switch (status) {
      case 'Atrasado':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: 'Em andamento'
        });
        break;
      case 'Pendente':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: 'Em andamento'
        });
        break;
      case 'Em andamento':
        await UpdateTaskStatusFn({ 
          taskId: taskId,
          projectId: projectId,
          status: 'Finalizado'
        });
        break;
    }
  }

  const { mutateAsync: UpdateTaskStatusFn, isPending } = useMutation({
    mutationFn: UpdateTaskStatus,
    onSuccess() {
      toast.success('Status atualizado.');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectIdString ]});
    }
  });
  
  return (
    <>
      {member?.FUNCAO === 'Administrador' ? (
        <Select onValueChange={handleStatusChange} defaultValue={status}>
        <SelectTrigger disabled={isPending}>
          <SelectValue placeholder={<Status status={status} />} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Atrasado">
            <div className="flex items-center text-rose-600 font-semibold">
              <HelpCircle className="mr-2 h-4 w-4 " />
              <span>Atrasado</span>
            </div>
          </SelectItem>
          <SelectItem value="Pendente">
            <div className="flex items-center">
              <Circle className="mr-2 h-4 w-4 " />
              <span>Pendente</span>
            </div>
          </SelectItem>
          <SelectItem value="Em andamento">
            <div className="flex items-center">
              <Timer className="mr-2 h-4 w-4 " />
              <span>Em andamento</span>
            </div>
          </SelectItem>
          <SelectItem value="Finalizado">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 " />
              <span>Finalizado</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      ) : (
        <Button disabled={isPending || status === 'Finalizado'} variant="outline" className="flex items-center gap-1" onClick={() => updateTaskStatus(status)}>
          <Status status={status} />
          {status !== "Finalizado" && <ChevronRight className="size-4" />}
        </Button>
      )}
    </>
  )
}