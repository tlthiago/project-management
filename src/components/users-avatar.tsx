import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface UsersAvatarProps {
  members?: string;
}

function getInitials(memberName: string): string {
  const parts = memberName.split(' ');
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const initials = firstName.charAt(0) + lastName.charAt(0);

  return initials;
}

const UserAvatar: React.FC<{ member: string }> = ({ member }) => {
  const initials = getInitials(member);

  return (
    <TooltipProvider key={member}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{member}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const UsersGroup: React.FC<{ members: string[] }> = ({ members }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-muted text-xs">
            +{members.length}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        {members.map((member, index) => (
          <div className="text-sm" key={index}>
            {member}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export function UsersAvatar({ members }: UsersAvatarProps) {
  const membersArray: string[] =
    members?.split(',').map((name) => name.trim()) || [];

  return (
    <div className="flex gap-1">
      {membersArray.length > 2 ? (
        <>
          {membersArray.slice(0, 2).map((member, index) => (
            <UserAvatar key={index} member={member} />
          ))}
          <UsersGroup members={membersArray.slice(2)} />
        </>
      ) : (
        membersArray.map((member, index) => (
          <UserAvatar key={index} member={member} />
        ))
      )}
    </div>
  );
}
