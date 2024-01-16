import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { TaskCard } from './task-card';

interface TasksContainerProps {
  borderColor: string;
  title: string;
}

export function TasksContainer({ borderColor, title }: TasksContainerProps) {
  return (
    <div
      className={`space-y-3 rounded-xl border-t-4 ${borderColor} bg-zinc-100 p-5 shadow-md`}
    >
      <div className="flex items-center gap-3 rounded">
        <div className="flex items-center gap-3">
          <span className="ml-2 font-semibold">{title}</span>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-slate-200 text-sm">3</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="max-h-[38rem] space-y-3 overflow-auto">
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  );
}
