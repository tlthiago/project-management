import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';

import { TaskDetails } from './task-details';
import { UserAvatar } from './user-avatar';

// export interface OrderTableRowProps {}

export function TaskTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da tarefa</span>
            </Button>
          </DialogTrigger>
          <TaskDetails />
        </Dialog>
      </TableCell>
      <TableCell className="font-medium">
        Project X dashboard UI design
      </TableCell>
      <TableCell className="line-clamp-1 text-xs">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo,
        reprehenderit tempore eum voluptatem sequi corrupti libero provident
        neque magni dolorum dicta alias modi commodi magnam ducimus laborum
        nobis accusantium fugiat?
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-200 text-zinc-500">Pendente</Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-200 text-green-500">Baixa</Badge>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-xs">16/01/2024 a 20/01/2024</TableCell>
      <TableCell className="text-xs">
        Desenvolvimento de Sistemas, Suporte e Automação
      </TableCell>
      <TableCell className="flex">
        <UserAvatar userInitials="TA" />
        <UserAvatar userInitials="TA" />
        <UserAvatar userInitials="TA" />
        <UserAvatar userInitials="TA" />
        <UserAvatar userInitials="TA" />
      </TableCell>
    </TableRow>
  );
}
