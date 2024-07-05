import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Member {
  CHAPA: string;
  NOME: string;
}
interface UsersAvatarProps {
  members?: Member[];
}

function getInitials(memberName: string): string {
  const parts = memberName.split(' ');
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const initials = firstName.charAt(0) + lastName.charAt(0);

  return initials;
}

const UserAvatar: React.FC<{ member: Member }> = ({ member }) => {
  const initials = getInitials(member.NOME);

  return (
    <TooltipProvider key={member.CHAPA}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{member.NOME}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const UsersGroup: React.FC<{ members: Member[] }> = ({ members }) => {
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
            {member.NOME}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export function UsersAvatar({ members }: UsersAvatarProps) {
  return (
    <div className="flex gap-1">
      {members && members.length > 2 ? (
        <>
          {members.slice(0, 2).map((member, index) => (
            <UserAvatar key={index} member={member} />
          ))}
          <UsersGroup members={members.slice(2)} />
        </>
      ) : (
        members &&
        members.map((member, index) => (
          <UserAvatar key={index} member={member} />
        ))
      )}
    </div>
  );
}
