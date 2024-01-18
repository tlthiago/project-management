import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { TaskCard } from './task-card';

interface TasksContainerProps {
  circleColor: string;
  title: string;
}

export function TasksContainer({ circleColor, title }: TasksContainerProps) {
  return (
    <Card className="w-96 border-0">
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
        <ScrollArea className="lg:h-[36rem]">
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
