'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import {
  getNumberProjectsByTeam,
  GetNumberProjectsByTeamResponse
} from '@/app/api/projetos/dashboard/get-number-projects-by-team';

export function ProjectsByTeam() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';

  const { data: projectsNumbers = [] } = useQuery<
    GetNumberProjectsByTeamResponse[]
  >({
    queryKey: ['numberProjects', codDepartment],
    queryFn: () => getNumberProjectsByTeam({ codDepartment }),
    enabled: !!codDepartment
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={projectsNumbers}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 15 }}
      >
        <XAxis type="number" />
        <YAxis dataKey="EQUIPE" type="category" fontSize={14} width={200} />
        <Tooltip contentStyle={{ color: '#000000' }} />
        <Bar dataKey="QUANTIDADE" fill="currentColor" className="fill-primary">
          <LabelList dataKey="QUANTIDADE" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
