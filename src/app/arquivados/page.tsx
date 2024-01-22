import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { columns } from './components/data-table/columns';
import { DataTable } from './components/data-table/data-table';
import { Project } from './data/schema';

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
      status: 'archived',
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
      status: 'archived',
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
      status: 'archived',
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
      status: 'archived',
      priority: 'high'
    }
  ];
}

export default async function Archived() {
  const data = await getData();

  return (
    <div className="space-y-5 p-5">
      <h1 className="text-3xl font-bold tracking-tight">Arquivados</h1>
      <Card>
        <CardContent className="pt-5">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
