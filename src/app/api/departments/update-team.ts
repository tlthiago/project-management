import { api } from '@/lib/axios';

interface memberData {
  chapa: string,
  memberName: string
}

export interface UpdateTeamBody {
  teamId: string
  teamName: string
  department: string
  removed?: memberData[]
  added?: memberData[]
  usuInclusao: string
}

export async function updateTeam({
  teamId,
  teamName,
  department,
  removed,
  added,
  usuInclusao
}: UpdateTeamBody) {
  const teamData = {
    teamName,
    department,
    removed,
    added,
    usuInclusao
  };

  console.log(teamData);
  
  await api.put(`/teams/${teamId}`, teamData);
}