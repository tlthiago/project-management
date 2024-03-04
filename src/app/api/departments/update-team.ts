import { api } from '@/lib/axios';

export interface UpdateTeamBody {
  teamId: string
  teamName?: string
  removed?: string[]
  added?: string[]
  usuInclusao: string
}

export async function updateTeam({
  teamId,
  teamName,
  removed,
  added,
  usuInclusao
}: UpdateTeamBody) {
  const teamData = {
    teamName,
    removed,
    added,
    usuInclusao
  };
  
  await api.put(`/teams/${teamId}`, teamData);
}