import { useQuery } from '@tanstack/react-query';

import { getProjects } from '@/app/api/get-projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { CreateProjectForm } from './components/create-project-form';
import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';

export default async function Projects() {
  // const { data: projects } = useQuery({
  //   queryKey: ['projects'],
  //   queryFn: getProjects
  // });

  // const allProjects: [] = projects;

  return (
    <div className="space-y-5 p-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Novo projeto</Button>
          </DialogTrigger>
          <CreateProjectForm />
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-5">
          {/* <DataTable columns={columns} data={projects} /> */}
        </CardContent>
      </Card>
    </div>
  );
}
