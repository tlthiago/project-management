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
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { UpdateProjectStatus } from "@/app/api/projetos/update-project-status";

interface ProjectStatusProps {
  projectId: number;
  status: string;
}

export default function ProjectStatus({ projectId, status }: ProjectStatusProps) {
  const { data: session } = useSession();
  const chapa = session?.user.CHAPA ?? '';

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });
  
  const handleStatusChange = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateProjectStatusFn({ 
          projectId: projectId,
          status: status
        });
        break;
      case 'Em andamento':
        await UpdateProjectStatusFn({ 
          projectId: projectId,
          status: status
        });
        break;
      case 'Finalizado':
        await UpdateProjectStatusFn({ 
          projectId: projectId,
          status: status
        });
        break;
    }
  }

  const updateProjectStatus = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateProjectStatusFn({ 
          projectId: projectId,
          status: 'Em andamento'
        });
        break;
      case 'Em andamento':
        await UpdateProjectStatusFn({ 
          projectId: projectId,
          status: 'Finalizado'
        });
        break;
    }
  }

  const { mutateAsync: UpdateProjectStatusFn, isPending } = useMutation({
    mutationFn: UpdateProjectStatus,
    onSuccess() {
      toast.success('Status atualizado.');
      queryClient.invalidateQueries({ queryKey: ['projects']});
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
        <Button disabled={isPending || status === 'Finalizado'} variant="outline" className="flex items-center gap-1" onClick={() => updateProjectStatus(status)}>
          <Status status={status} />
          {status !== "Finalizado" && <ChevronRight className="size-4" />}
        </Button>
      )}
    </>
  )
}