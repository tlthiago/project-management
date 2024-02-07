'use client'

import { 
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { membersColumns } from "./components/data-tables/members/members-columns";
import { teamsColumns } from "./components/data-tables/teams/teams-columns";
import { DataTableMembers } from "./components/data-tables/members/data-table";
import { DataTableTeams } from "./components/data-tables/teams/data-table";
import { GetMembersByDepartmentResponse, getMembersByDepartment } from "@/app/api/departments/get-members-by-department";
import { useQuery } from "@tanstack/react-query";
import { GetTeamsByDepartmentResponse, getTeamsByDepartment } from "@/app/api/departments/get-teams-by-department";
import { CreateTeamForm } from "./components/create-team-form";
import { useState } from "react";

export default function Membros() {
  const department = 'TECNOLOGIA DA INFORMACAO';

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', department],
    queryFn: () => getTeamsByDepartment({ department })
  });

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department })
  });

  const [tabsTrigger, setTabsTriggerValue] = useState(true)
  
  return (
    <div className="space-y-5 p-5">
      <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
      <Card>
        <CardHeader>
          <Tabs defaultValue="members">
            <div className={`flex ${tabsTrigger ? 'justify-end' : 'justify-between'}`}>
              {!tabsTrigger && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='secondary'>Nova equipe</Button>
                  </DialogTrigger>
                  <CreateTeamForm department={department} />
                </Dialog>
              )}
              <TabsList className="bg-muted">
                <TabsTrigger value="members" onClick={() => setTabsTriggerValue(true)}>
                  <span>Membros</span>
                </TabsTrigger>
                <TabsTrigger value="teams" onClick={() => setTabsTriggerValue(false)}>
                  <span>Equipes</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="members">
              <DataTableMembers columns={membersColumns} data={members} />
            </TabsContent>
            <TabsContent value="teams">
              <DataTableTeams columns={teamsColumns} data={teams} />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
