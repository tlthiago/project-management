import { api } from '@/lib/axios';

export interface CreateTeamBody {
  teamName: string
  department: string
  chapas: string[]
  members: string[]
  usuInclusao: string
}

export async function createTeam({
  teamName,
  department,
  chapas,
  members,
  usuInclusao
}: CreateTeamBody) {
  const teamData = {
    teamName,
    department,
    chapas,
    members,
    usuInclusao
  };
  
  await api.post("/teams/create", teamData);
}