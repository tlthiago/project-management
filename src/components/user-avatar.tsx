import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UsersAvatarProps {
  member: string;
}

function getInitials(memberName: string): string {
  const parts = memberName.split(' ');
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const initials = firstName.charAt(0) + lastName.charAt(0);

  return initials;
}

export function UserAvatar({ member }: UsersAvatarProps) {
  const initials = getInitials(member);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-xs">{initials}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{member}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}