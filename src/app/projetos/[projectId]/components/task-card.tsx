import { GripVertical, MessageCircleMore } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { UserAvatar } from './user-avatar';

export function TaskCard() {
  return (
    <div className="space-y-3 rounded-xl border bg-zinc-50 p-3 shadow-sm">
      <div className="flex justify-between">
        <span className="truncate font-semibold">
          Project X dashboard UI design Project X dashboard UI design Project X
          dashboard UI design Project X dashboard UI design
        </span>
        <div>
          <GripVertical className="ml-2 h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">
          Dashboard UI design is a visually engaging and intuitively structured
          interface tailored to streamline project management
        </p>
      </div>
      <div className="flex justify-between">
        <Badge className="h-4 bg-green-200 text-green-500">Baixa</Badge>
        <span className="text-muted-foreground text-right text-xs">
          16/01/2024 - 20/01/2024
        </span>
      </div>
      <div className="flex items-center">
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
  );
}
