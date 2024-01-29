import { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// import { UserAvatar } from '../../../components/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { GetProjectByIdResponse, getProjectById } from '@/app/api/projetos/get-project-by-id';

interface ProjectDetailsProps {
  projectId?: string
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId })
  })

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
              <div className="flex items-center gap-2">
                <Badge className="bg-zinc-200 text-zinc-500">
                  {project?.STATUS}
                </Badge>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Prioridade</TableCell>
            <TableCell className="flex justify-end">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-200 text-green-500">
                  {project?.PRIORIDADE}
                </Badge>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Datas</TableCell>
            <TableCell className="text-right">
              <span>
                {project?.DATA_INICIO} - {project?.DATA_FIM}
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
              {project?.RESPONSAVEIS}
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
