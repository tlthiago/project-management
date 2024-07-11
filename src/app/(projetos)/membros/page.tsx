'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import {
  getMembers,
  GetMembersResponse
} from '@/app/api/departments/get-members';
import {
  getMembersByDepartment,
  GetMembersByDepartmentResponse
} from '@/app/api/departments/get-members-by-department';
import { getTeams, GetTeamsResponse } from '@/app/api/departments/get-teams';
import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CreateTeamForm } from './components/create-team-form';
import { DataTableMembers } from './components/data-tables/members/data-table';
import { membersColumns } from './components/data-tables/members/members-columns';
import { DataTableTeams } from './components/data-tables/teams/data-table';
import { teamsColumns } from './components/data-tables/teams/teams-columns';

interface Member {
  CHAPA: string;
  NOME: string;
  LOJA: number;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  CARGO: string;
  FUNCAO: string;
  EQUIPE_ID: number;
  EQUIPE: string;
}

interface TeamMember {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  MEMBROS: TeamMember[];
}

export default function Membros() {
  const { data: session } = useSession();
  const codDepartment = session?.user.CODSETOR ?? '';
  const role = session?.user.FUNCAO ?? '';

  const [tabsTrigger, setTabsTriggerValue] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);

  const { data: adminMembers = [] } = useQuery<GetMembersResponse[]>({
    queryKey: ['members'],
    queryFn: () => getMembers(),
    enabled: !!role && role === 'Administrador'
  });

  const { data: managerMembers = [] } = useQuery<
    GetMembersByDepartmentResponse[]
  >({
    queryKey: ['members-by-department', codDepartment],
    queryFn: () => getMembersByDepartment({ codDepartment }),
    enabled: !!codDepartment && role === 'Gerente'
  });

  const { data: adminTeams = [] } = useQuery<GetTeamsResponse[]>({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
    enabled: !!tabsTrigger && !!role && role === 'Administrador'
  });

  const { data: managerTeams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams-by-department', codDepartment],
    queryFn: () => getTeamsByDepartment({ codDepartment }),
    enabled: !!tabsTrigger && !!codDepartment && role === 'Gerente'
  });

  let members: Member[] = [];
  let teams: Team[] = [];

  if (role === 'Administrador') {
    members = adminMembers;
    teams = adminTeams;
  } else if (role === 'Gerente' && codDepartment) {
    members = managerMembers;
    teams = managerTeams;
  }

  return (
    <div>
      <Tabs defaultValue="members" className="space-y-5">
        <div className="flex justify-between">
          {!tabsTrigger ? (
            <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">Equipes</h1>
          )}
          <div className="space-x-2">
            {tabsTrigger && (
              <Dialog open={creatingTeam} onOpenChange={setCreatingTeam}>
                <DialogTrigger asChild>
                  <Button variant="default">Criar equipe</Button>
                </DialogTrigger>
                <CreateTeamForm open={creatingTeam} />
              </Dialog>
            )}
            <TabsList className="bg-neutral-200">
              <TabsTrigger
                value="members"
                onClick={() => setTabsTriggerValue(false)}
              >
                <span>Membros</span>
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                onClick={() => setTabsTriggerValue(true)}
              >
                <span>Equipes</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="members" className="mt-0">
              <DataTableMembers columns={membersColumns} data={members} />
            </TabsContent>
            <TabsContent value="teams" className="mt-0">
              <DataTableTeams columns={teamsColumns} data={teams} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
