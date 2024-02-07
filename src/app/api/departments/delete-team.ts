import { api } from '@/lib/axios';

export interface DeleteTeamBody {
  teamId: string
}

export async function deleteTeam({
  teamId,
}: DeleteTeamBody) {
    
  await api.delete(`/team/${teamId}`);
}