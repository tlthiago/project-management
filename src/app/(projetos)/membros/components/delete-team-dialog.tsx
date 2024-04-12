import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { deleteTeam } from '@/app/api/departments/delete-team';
import {
  getCurrentProjectsByTeam,
  GetCurrentProjectsByTeamResponse
} from '@/app/api/projetos/get-current-projects-by-team';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface DeleteTeamProps {
  teamId: number;
  open: boolean;
}

export function DeleteTeam({ teamId, open }: DeleteTeamProps) {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: currentProjects = [] } = useQuery<
    GetCurrentProjectsByTeamResponse[]
  >({
    queryKey: ['currentProjects', department],
    queryFn: () => getCurrentProjectsByTeam({ teamId }),
    enabled: !!open
  });

  const queryClient = useQueryClient();

  const { mutateAsync: deleteTeamFn } = useMutation({
    mutationFn: deleteTeam,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['teams', department] });
      queryClient.invalidateQueries({ queryKey: ['members', department] });
    }
  });

  async function handleSubmit(teamId: number) {
    try {
      await deleteTeamFn({
        teamId: teamId,
        usuAtualizacao: session?.user.CODUSUARIO ?? 'MM_WEB'
      });

      toast.success('A equipe foi excluída!');
    } catch {
      toast.error('Erro ao excluir a equipe, contate o administrador.');
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
        <AlertDialogDescription>
          {currentProjects.length > 0 ? (
            <>
              <span>
                Remova a equipe dos sequintes projetos para que ela possa ser
                excluída:
              </span>
              {currentProjects?.map((project) => (
                <span className="font-bold" key={project.ID}>
                  <br />
                  {project.NOME}
                </span>
              ))}
            </>
          ) : (
            <span className="mb-2">
              Tem certeza que deseja excluir a equipe? Essa ação não pode ser
              desfeita.
            </span>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          type="submit"
          onClick={() => handleSubmit(teamId)}
          disabled={currentProjects.length > 0}
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
