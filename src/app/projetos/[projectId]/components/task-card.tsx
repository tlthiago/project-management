import { MessageCircleMore } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { TaskDetails } from './task-details';
import { UserAvatar } from './user-avatar';

export function TaskCard() {
  return (
    <Dialog>
      <DialogTrigger>
        <Card>
          <CardHeader className="text-left">
            <CardTitle className="line-clamp-1 text-base">
              Project X dashboard UI design
            </CardTitle>
            <CardDescription className="line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat,
              iure provident, qui eaque ipsa, exercitationem reiciendis quod
              quam ipsum dolorum vitae unde alias laborum quaerat sequi nam
              dolorem minima sunt!
            </CardDescription>
          </CardHeader>
          <CardFooter className="grid grid-cols-3">
            <div className="flex">
              <UserAvatar userInitials="TA" />
              <UserAvatar userInitials="TA" />
              <UserAvatar userInitials="TA" />
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">+2</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-end">
              <Badge className="bg-rose-500 text-rose-50 hover:bg-rose-500/80">
                Alta
              </Badge>
            </div>
            <div className="ml-auto flex gap-0.5">
              <MessageCircleMore className="h-5 w-5" />
              <span className="text-xs">2</span>
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <TaskDetails></TaskDetails>
    </Dialog>
  );
}
