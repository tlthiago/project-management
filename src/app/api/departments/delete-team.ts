import { api } from '@/lib/axios';

export interface DeleteTeamParams {
  teamId: string;
  usuAtualizacao: string;
}

export async function deleteTeam({ teamId, usuAtualizacao }: DeleteTeamParams) {
  await api.put(`/teams/delete/${teamId}`, { usuAtualizacao });
}
