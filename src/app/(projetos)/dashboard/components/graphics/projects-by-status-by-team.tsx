'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import {
  getNumberProjectsByStatusAndTeam,
  GetNumberProjectsByStatusAndTeamResponse
} from '@/app/api/projetos/dashboard/get-num-proj-by-status-n-team';

export function ProjectsByStatusAndTeam() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';

  const { data: projectsNumbersByStatus = [] } = useQuery<
    GetNumberProjectsByStatusAndTeamResponse[]
  >({
    queryKey: ['numberProjects', codDepartment],
    queryFn: () => getNumberProjectsByStatusAndTeam({ codDepartment }),
    enabled: !!codDepartment
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={projectsNumbersByStatus}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 15 }}
      >
        <XAxis type="number" />
        <YAxis dataKey="NOME" type="category" fontSize={14} width={200} />
        <Tooltip contentStyle={{ color: '#000000' }} />
        <Legend verticalAlign="bottom" />
        <Bar dataKey="PENDENTE" fill="#737373" stackId="a" />
        <Bar dataKey="EM_ANDAMENTO" fill="#0891b2" stackId="a" />
        <Bar dataKey="FINALIZADO" fill="#10b981" stackId="a" />
        <Bar dataKey="ATRASADO" fill="#f43f5e" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
