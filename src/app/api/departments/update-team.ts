import { api } from '@/lib/axios';

interface MemberData {
  chapa: string,
  memberName: string
}

export interface UpdateTeamBody {
  teamId: string
  teamName?: string
  department: string
  removed?: MemberData[]
  added?: MemberData[]
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
  
  await api.put(`/teams/${teamId}`, teamData);
}