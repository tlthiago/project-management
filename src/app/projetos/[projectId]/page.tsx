import { TasksContainer } from '@/app/projetos/[projectId]/components/tasks-container';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export default function Page({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            My Project: {params.projectId}
          </h1>
          <p className="text-muted-foreground text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
            sapiente beatae, libero cum consequatur impedit, commodi quasi qui
            praesentium iure deserunt. Quis nobis beatae dignissimos temporibus
            magni! Modi, laborum consectetur! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Odit sapiente beatae, libero cum
            consequatur impedit, commodi quasi qui praesentium iure deserunt.
          </p>
          <div className="flex items-center space-x-2">
            <Progress className="h-2 w-96" value={33} />
            <span className="text-muted-foreground text-xs">33% completo</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-right text-sm">
            Equipes: Desenvolvimento de Sistemas, Suporte e Automação
          </span>
          <div className="ml-auto flex justify-end">
            <Avatar>
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>+2</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 space-x-6">
        <TasksContainer borderColor="border-rose-400" title="Atrasado" />
        <TasksContainer borderColor="border-slate-400" title="Pendente" />
        <TasksContainer borderColor="border-yellow-400" title="Em Andamento" />
        <TasksContainer borderColor="border-emerald-400" title="Finalizado" />
      </div>
    </div>
  );
}
