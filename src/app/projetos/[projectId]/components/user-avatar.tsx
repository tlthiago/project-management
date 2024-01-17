import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';

interface UserAvatarProps {
  userInitials: string;
}

export function UserAvatar({ userInitials }: UserAvatarProps) {
  return (
    <Avatar className="h-7 w-7">
      <AvatarFallback className="bg-slate-200 text-xs">
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
}
