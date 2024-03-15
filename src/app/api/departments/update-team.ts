import { api } from '@/lib/axios';

export interface UpdateTeamBody {
  teamId: string;
  teamName?: string;
  removed?: string[];
  added?: string[];
  usuInclusao: string;
  usuAtualizacao: string;
}

export async function updateTeam({
  teamId,
  teamName,
  removed,
  added,
  usuInclusao,
  usuAtualizacao
}: UpdateTeamBody) {
  const teamData = {
    teamName,
    removed,
    added,
    usuInclusao,
    usuAtualizacao
  };

  await api.put(`/teams/${teamId}`, teamData);
}
