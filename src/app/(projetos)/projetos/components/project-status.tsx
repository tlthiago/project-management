import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, ChevronRight, Circle, Timer } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  getMemberByChapa,
  GetMemberByChapaResponse
} from '@/app/api/departments/get-member-by-chapa';
import {
  getTeamCoordinatorByTeamId,
  GetTeamCoordinatorByTeamIdResponse
} from '@/app/api/departments/get-team-coordinator-by-team-id';
import { UpdateProjectStatus } from '@/app/api/projetos/update-project-status';
import Status from '@/components/status';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { queryClient } from '@/lib/react-query';

interface ProjectStatusProps {
  projectId: number;
  status: string;
}

export default function ProjectStatus({
  projectId,
  status
}: ProjectStatusProps) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';
  const chapa = session?.user.CHAPA ?? '';

  const { data: member } = useQuery<GetMemberByChapaResponse>({
    queryKey: ['member', chapa],
    queryFn: () => getMemberByChapa({ chapa }),
    enabled: !!chapa
  });

  const managerUser =
    member?.FUNCAO === 'Administrador' || member?.FUNCAO === 'Coordenador';

  const teamId = member?.FUNCAO === 'Membro' ? member?.EQUIPE_ID : undefined;

  const { data: coordinatorData } =
    useQuery<GetTeamCoordinatorByTeamIdResponse>({
      queryKey: ['Coordinator', teamId],
      queryFn: () => getTeamCoordinatorByTeamId({ teamId }),
      enabled: !!teamId
    });

  const handleStatusChange = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO
            ? session.user.CODUSUARIO
            : 'MM_WEB'
        });
        break;
      case 'Em andamento':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO
            ? session.user.CODUSUARIO
            : 'MM_WEB'
        });
        break;
      case 'Finalizado':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: status,
          usuAtualizacao: session?.user.CODUSUARIO
            ? session.user.CODUSUARIO
            : 'MM_WEB'
        });
        break;
    }
  };

  const updateProjectStatus = async (status: string) => {
    switch (status) {
      case 'Pendente':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: 'Em andamento',
          usuAtualizacao: session?.user.CODUSUARIO
            ? session.user.CODUSUARIO
            : 'MM_WEB'
        });
        break;
      case 'Em andamento':
        await UpdateProjectStatusFn({
          projectId: projectId,
          status: 'Finalizado',
          usuAtualizacao: session?.user.CODUSUARIO
            ? session.user.CODUSUARIO
            : 'MM_WEB'
        });
        break;
    }
  };

  const { mutateAsync: UpdateProjectStatusFn, isPending } = useMutation({
    mutationFn: UpdateProjectStatus,
    onSuccess() {
      toast.success('Status atualizado.');
      queryClient.invalidateQueries({ queryKey: ['projects', department] });
      queryClient.invalidateQueries({
        queryKey: ['coordinator-projects', coordinatorData?.CHAPA]
      });
      queryClient.invalidateQueries({ queryKey: ['member-projects', chapa] });
    }
  });

  return (
    <>
      {managerUser ? (
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
        <Button
          disabled={isPending || status === 'Finalizado'}
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => updateProjectStatus(status)}
        >
          <Status status={status} />
          {status !== 'Finalizado' && <ChevronRight className="size-4" />}
        </Button>
      )}
    </>
  );
}
