import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TaskComment } from './task-comment';
import { UserAvatar } from './user-avatar';

export function TaskDetails() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Project X dashboard UI design</DialogTitle>
      </DialogHeader>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Status</TableCell>
            <TableCell className="flex justify-end">
              <Badge className="bg-zinc-200 text-zinc-500 hover:bg-zinc-200/90">
                A fazer
              </Badge>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">Prioridade</TableCell>
            <TableCell className="flex justify-end">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-green-50 hover:bg-green-500/90">
                  Baixa
                </Badge>
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
              Desenvolvimento de Sistemas, Suporte e Automação
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="text-muted-foreground">
              Responsáveis
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
              <UserAvatar userInitials="TA" userName="Thiago Alves" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Tabs defaultValue="description">
        <div className="bg-muted">
          <TabsList>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="description"
          className="mt-0 p-4 align-middle text-sm hover:bg-muted/50"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio non
          maxime deserunt, dolore ullam corrupti hic assumenda at, quae nobis
          nemo praesentium inventore ut impedit, natus ducimus quo! Ab,
          consequatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Iure deserunt perferendis asperiores sed. Hic temporibus aspernatur,
          quasi nulla veritatis, distinctio asperiores labore odio non eum error
          commodi natus similique minima!
        </TabsContent>
        <TabsContent value="comments" className="mt-0">
          <ScrollArea className="h-56 p-4 align-middle">
            <div className="space-y-3">
              <TaskComment />
              <TaskComment />
              <TaskComment />
            </div>
          </ScrollArea>
          <div className="flex items-center gap-3">
            <UserAvatar userInitials="TA" userName="Thiago Alves" />
            <Input placeholder="Adicione um comentário..." />
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
