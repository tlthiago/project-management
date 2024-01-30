import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
            <AvatarFallback className="bg-muted text-xs">{initials}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{member}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function UsersAvatar({ members }: UsersAvatarProps) {
  const membersArray: string[] = members?.split(',').map((name) => name.trim()) || [];

  return (
    <div className='flex gap-1'>
      {membersArray.map((member, index) => (
        <UserAvatar key={index} member={member} />
      ))}
    </div>
  )
}