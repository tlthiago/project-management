import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UserAvatarProps {
  userName: string;
  userInitials: string;
}

export function UserAvatar({ userInitials, userName }: UserAvatarProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{userName}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
