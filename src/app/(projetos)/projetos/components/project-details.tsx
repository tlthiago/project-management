import { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { UserAvatar } from '../../../components/user-avatar';

interface TaskDetailsProps<TData> {
  row: Row<TData>;
}

export function ProjectDetails<TData>({ row }: TaskDetailsProps<TData>) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{row.getValue('NOME')}</DialogTitle>
      </DialogHeader>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Status</TableCell>
            <TableCell className="flex justify-end">
              <div className="flex items-center gap-2">
                <Badge className="bg-zinc-200 text-zinc-500">
                  {row.getValue('STATUS')}
                </Badge>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Prioridade</TableCell>
            <TableCell className="flex justify-end">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-200 text-green-500">
                  {row.getValue('PRIORIDADE')}
                </Badge>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Datas</TableCell>
            <TableCell className="text-right">
              <span>
                {row.getValue('DATA_INICIO')} - {row.getValue('DATA_FIM')}
              </span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Equipes</TableCell>
            <TableCell className="text-right">
              <span>{row.getValue('EQUIPES')}</span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">
              Responsáveis
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              {row.getValue('RESPONSAVEIS')}
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
          {row.getValue('DESCRICAO')}
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
