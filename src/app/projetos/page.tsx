import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { Project } from '../api/data/schema';
import { CreateProjectForm } from './components/create-project-form';
import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';

async function getData(): Promise<Project[]> {
  return [
    {
      id: '1',
      name: 'Projeto 1',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Desenvolvimento de Sistemas', 'Suporte e Automação'],
      members: [
        'Thiago Alves',
        'Paulo Gonçalves',
        'Gabriel Souza',
        'Alexsander Rocha',
        'Lucas Alexandre',
        'Fábio Bessa',
        'Carolina Barbosa',
        'Lucas Dias'
      ],
      status: 'in progress',
      priority: 'medium'
    },
    {
      id: '2',
      name: 'Projeto 2',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Suporte e Automação'],
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'todo',
      priority: 'low'
    },
    {
      id: '3',
      name: 'Projeto 3',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Comercial, Depto de Vendas, Logística'],
      members: ['Kennedy Oliveira', 'Gleiton Bessa'],
      status: 'done',
      priority: 'high'
    },
    {
      id: '4',
      name: 'Projeto 4',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Integração'],
      members: ['Caio Wendel'],
      status: 'todo',
      priority: 'high'
    },
    {
      id: '5',
      name: 'Projeto 5',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['RH, DP e QSMS'],
      members: ['Marcus Oliveira', 'Ronaldo Sena'],
      status: 'in progress',
      priority: 'medium'
    },
    {
      id: '6',
      name: 'Projeto 6',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Desenvolvimento de Sistemas', 'Suporte e Automação'],
      members: [
        'Thiago Alves',
        'Paulo Gonçalves',
        'Gabriel Souza',
        'Alexsander Rocha',
        'Lucas Alexandre',
        'Fábio Bessa',
        'Carolina Barbosa',
        'Lucas Dias'
      ],
      status: 'in progress',
      priority: 'medium'
    },
    {
      id: '7',
      name: 'Projeto 7',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Suporte e Automação'],
      members: ['Gabriel Souza', 'Lucas Dias'],
      status: 'todo',
      priority: 'low'
    },
    {
      id: '8',
      name: 'Projeto 8',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Comercial, Depto de Vendas, Logística'],
      members: ['Kennedy Oliveira', 'Gleiton Bessa'],
      status: 'done',
      priority: 'high'
    },
    {
      id: '9',
      name: 'Projeto 9',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['Integração'],
      members: ['Caio Wendel'],
      status: 'todo',
      priority: 'high'
    },
    {
      id: '10',
      name: 'Projeto 10',
      dateRange: {
        from: 'Tue Jan 09 2024 10:45:59 GMT-0300 (Horário Padrão de Brasília)',
        to: 'Tue Jan 11 2024 15:45:59 GMT-0300 (Horário Padrão de Brasília)'
      },
      description:
        "You can't compress the program without quantifying the open-source SSD pixel!",
      teams: ['RH, DP e QSMS'],
      members: ['Marcus Oliveira', 'Ronaldo Sena'],
      status: 'in progress',
      priority: 'medium'
    }
  ];
}

export default async function Projects() {
  const data = await getData();

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
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
