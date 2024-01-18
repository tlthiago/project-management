import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TaskComment } from './task-comment';
import { UserAvatar } from './user-avatar';

export function TaskDetails() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Project X dashboard UI design</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <Badge className="bg-zinc-200 text-zinc-500">A fazer</Badge>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Prioridade
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-green-50">Baixa</Badge>
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
          <Tabs defaultValue="description">
            <TableHeader>
              <TableHead className="rounded bg-muted">
                <TabsList>
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
              </TableHead>
            </TableHeader>
            <TableBody>
              <TabsContent value="description">
                <TableRow>
                  <TableCell>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Odio non maxime deserunt, dolore ullam corrupti hic
                    assumenda at, quae nobis nemo praesentium inventore ut
                    impedit, natus ducimus quo! Ab, consequatur. Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Iure deserunt
                    perferendis asperiores sed. Hic temporibus aspernatur, quasi
                    nulla veritatis, distinctio asperiores labore odio non eum
                    error commodi natus similique minima!
                  </TableCell>
                </TableRow>
              </TabsContent>
              <TabsContent value="comments">
                <Table>
                  <TableBody>
                    <ScrollArea className="h-64">
                      <TableRow>
                        <TableCell>
                          <TaskComment />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TaskComment />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TaskComment />
                        </TableCell>
                      </TableRow>
                    </ScrollArea>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="flex items-center gap-3">
                        <UserAvatar userInitials="TA" />
                        <Input placeholder="Adicione um comentário..." />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TabsContent>
            </TableBody>
          </Tabs>
        </Table>
      </div>
    </DialogContent>
  );
}
