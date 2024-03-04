import { api } from '@/lib/axios';

export interface CreateTeamBody {
  teamName: string
  department: string
  chapas: string[]
  usuInclusao: string
}

export async function createTeam({
  teamName,
  department,
  chapas,
  usuInclusao
}: CreateTeamBody) {
  const teamData = {
    teamName,
    department,
    chapas,
    usuInclusao
  };
  
  await api.post("/teams/create", teamData);
}