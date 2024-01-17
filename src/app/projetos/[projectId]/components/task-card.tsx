import { MessageCircleMore } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { TaskDetails } from './task-details';
import { UserAvatar } from './user-avatar';

export function TaskCard() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="space-y-3 rounded-xl border bg-white p-3 shadow-sm">
          <div className="flex justify-between">
            <span className="text-left font-semibold">
              Project X dashboard UI design
            </span>
          </div>
          <div>
            <p className="text-left text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
              neque voluptas, alias aut eaque quisquam itaque amet est minus
              recusandae dolorum necessitatibus officiis beatae quam nostrum
              exercitationem numquam, quos sint?
            </p>
          </div>
          <div className="flex justify-between">
            <Badge className="h-4 bg-green-200 text-green-500">Baixa</Badge>
            <span className="text-right text-xs text-muted-foreground">
              16/01/2024 - 20/01/2024
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <UserAvatar userInitials="TA" />
            <UserAvatar userInitials="TA" />
            <UserAvatar userInitials="TA" />
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">+2</AvatarFallback>
            </Avatar>
            <div className="ml-auto flex gap-0.5">
              <MessageCircleMore className="h-5 w-5" />
              <span className="text-xs">2</span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <TaskDetails></TaskDetails>
    </Dialog>
  );
}
