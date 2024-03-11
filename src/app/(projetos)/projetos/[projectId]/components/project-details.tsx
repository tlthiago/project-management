import { useQuery } from '@tanstack/react-query';

import {
  getProjectById,
  GetProjectByIdResponse
} from '@/app/api/projetos/get-project-by-id';
import Priority from '@/components/priority';
import Status from '@/components/status';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersAvatar } from '@/components/users-avatar';

interface ProjectDetailsProps {
  projectId: string;
  open: boolean;
}

export function ProjectDetails({ projectId, open }: ProjectDetailsProps) {
  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: open
  });

  const dataInicioString: string = project?.DATA_INICIO || '';
  const dataFimString: string = project?.DATA_FIM || '';

  const dataInicio = new Date(dataInicioString);
  const dataFim = new Date(dataFimString);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{project?.NOME}</DialogTitle>
      </DialogHeader>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Status</TableCell>
            <TableCell className="flex justify-end">
              <Status status={project?.STATUS} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Prioridade</TableCell>
            <TableCell className="flex justify-end">
              <Priority priority={project?.PRIORIDADE} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Datas</TableCell>
            <TableCell className="text-right">
              <span>
                {dataInicio.toLocaleDateString('pt-BR')} a{' '}
                {dataFim.toLocaleDateString('pt-BR')}
              </span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Equipes</TableCell>
            <TableCell className="text-right">
              <span>{project?.EQUIPES}</span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">
              Responsáveis
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <UsersAvatar members={project?.MEMBROS} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Tabs defaultValue="description">
        <div className="bg-muted">
          <TabsList>
            <TabsTrigger value="description">Descrição</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="description"
          className="mt-0 p-4 align-middle text-sm hover:bg-muted/50"
        >
          {project?.DESCRICAO}
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
