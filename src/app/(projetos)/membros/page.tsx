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
import { useSession } from "next-auth/react";

export default function Membros() {
  const { data: session } = useSession();
  const department = session?.user.SETOR ?? '';

  const { data: teams = [] } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', department],
    queryFn: () => getTeamsByDepartment({ department }),
    enabled: !!department
  });

  const { data: members = [] } = useQuery<GetMembersByDepartmentResponse[]>({
    queryKey: ['members', department],
    queryFn: () => getMembersByDepartment({ department }),
    enabled: !!department
  });

  const [tabsTrigger, setTabsTriggerValue] = useState(false);
  
  return (
    <div>
      <Tabs defaultValue="members" className="space-y-5">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
          <div className="space-x-2">
            {tabsTrigger && 
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='default'>Criar equipe</Button>
                </DialogTrigger>
                <CreateTeamForm />
              </Dialog>
            }
            <TabsList className="bg-muted">
              
              <TabsTrigger value="members" onClick={(e) => setTabsTriggerValue(false)}>
                <span>Membros</span>
              </TabsTrigger>
              <TabsTrigger value="teams" onClick={(e) => setTabsTriggerValue(true)}>
                <span>Equipes</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Card>
          <CardHeader>
            <TabsContent value="members" className="mt-0">
              <DataTableMembers columns={membersColumns} data={members} />
            </TabsContent>
            <TabsContent value="teams" className="mt-0">
              <DataTableTeams columns={teamsColumns} data={teams} />
            </TabsContent>
          </CardHeader>
        </Card>
      </Tabs>
    </div>
  );
}
