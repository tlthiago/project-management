import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { UserAvatar } from '../[projectId]/components/user-avatar';

export function ProjectDetails() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Projeto</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <Badge className="bg-zinc-200 text-zinc-500">Pendente</Badge>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Prioridade
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-200 text-green-500">Baixa</Badge>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Datas</TableCell>
              <TableCell className="text-right">
                <span>16/01/2024 a 20/01/2024</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Equipes</TableCell>
              <TableCell className="text-right">
                <span>Desenvolvimento de Sistemas, Suporte e Automação</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Responsáveis
              </TableCell>
              <TableCell className="flex justify-end gap-1">
                <UserAvatar userInitials="TA" />
                <UserAvatar userInitials="TA" />
                <UserAvatar userInitials="TA" />
                <UserAvatar userInitials="TA" />
                <UserAvatar userInitials="TA" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableHead className="rounded bg-muted">Descrição</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                non maxime deserunt, dolore ullam corrupti hic assumenda at,
                quae nobis nemo praesentium inventore ut impedit, natus ducimus
                quo! Ab, consequatur. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Iure deserunt perferendis asperiores sed. Hic
                temporibus aspernatur, quasi nulla veritatis, distinctio
                asperiores labore odio non eum error commodi natus similique
                minima!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
