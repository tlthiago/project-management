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

interface Member {
  CHAPA: string;
  NOME: string;
}

interface Team {
  ID: number;
  NOME: string;
}

interface ProjectDetailsProps {
  projectId: number;
  open: boolean;
}

export function ProjectDetails({ projectId, open }: ProjectDetailsProps) {
  const { data: project } = useQuery<GetProjectByIdResponse>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ projectId }),
    enabled: !!open && !!projectId
  });

  const dataInicioString: string | null = project?.DATA_INICIO || null;
  const dataFimString: string | null = project?.DATA_FIM || null;

  let dataInicio: Date = new Date();
  let dataFim: Date = new Date();

  if (dataInicioString !== null && dataFimString !== null) {
    dataInicio = new Date(dataInicioString);
    dataFim = new Date(dataFimString);
  }

  const teams = project?.EQUIPES.map((team: Team) => ({
    ID: team.ID,
    NOME: team.NOME
  }));

  const members: Member[] =
    project?.EQUIPES.flatMap((team) =>
      team.MEMBROS.map((member) => ({
        CHAPA: member.CHAPA,
        NOME: member.NOME
      }))
    ) || [];

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
                {dataInicioString === null
                  ? dataInicioString
                  : `${dataInicio.toLocaleDateString('pt-BR')} a `}
                {dataFimString === null
                  ? dataFimString
                  : dataFim.toLocaleDateString('pt-BR')}
              </span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Equipes</TableCell>
            <TableCell className="text-right">
              {teams?.map((team) => <div key={team.ID}>{team.NOME}</div>)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">
              Responsáveis
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <UsersAvatar members={members} />
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
