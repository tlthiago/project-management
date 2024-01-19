import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { TaskCard } from './task-card';

interface TasksContainerProps {
  circleColor: string;
  title: string;
}

export function TaskContainer({ circleColor, title }: TasksContainerProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex">
        <CardTitle className="flex justify-between text-base">
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${circleColor}`}></span>
            <span>{title}</span>
          </div>
          <Avatar className="h-6 w-6 shadow-sm">
            <AvatarFallback className="bg-muted text-sm">3</AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[35rem] max-h-[35rem]">
          {Array.from({ length: 5 }).map((_, i) => {
            return (
              <div className="mb-2" key={i}>
                <TaskCard />
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
