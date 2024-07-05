'use client';

import { useQuery } from '@tanstack/react-query';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

import {
  getDepartments,
  GetDepartmentsResponse
} from '@/app/api/departments/get-departments';
import {
  getTeamsByDepartment,
  GetTeamsByDepartmentResponse
} from '@/app/api/departments/get-teams-by-department';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function ShareProject() {
  const [department, setDepartment] = useState('');

  const { data: departments } = useQuery<GetDepartmentsResponse[]>({
    queryKey: ['deparments'],
    queryFn: () => getDepartments()
  });

  const { data: teams } = useQuery<GetTeamsByDepartmentResponse[]>({
    queryKey: ['teams', department],
    queryFn: () => getTeamsByDepartment({ department }),
    enabled: !!department
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="left" className="space-y-2">
        <p className="">Convidar</p>
        <Select onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments?.map((department) => (
              <SelectItem key={department.ID} value={department.ID}>
                {department.DEPARTAMENTO}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma equipe" />
          </SelectTrigger>
          <SelectContent>
            {teams?.map((team) => (
              <SelectItem key={team.ID} value={team.NOME}>
                {team.NOME}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o membro" />
          </SelectTrigger>
          <SelectContent>
            {/* {departments?.map((department) => (
              <SelectItem key={department.ID} value={department.ID}>
                {department.DEPARTAMENTO}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>

        <Button>Convidar</Button>
      </PopoverContent>
    </Popover>
  );
}
