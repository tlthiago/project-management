import { api } from '@/lib/axios';

export interface DeleteTeamParams {
  teamId: string;
}

export async function deleteTeam({ teamId }: DeleteTeamParams) {
  await api.delete(`/teams/${teamId}`);
}
