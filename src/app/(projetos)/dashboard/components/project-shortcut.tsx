import Priority from "@/components/priority";
import Status from "@/components/status";
import Link from 'next/link';

interface ProjectShortcutProps {
  id: number;
  name: string;
  teams: string;
  status: string;
  priority: string;
}

export default function ProjectShortcut({ 
  id,
  name,
  teams,
  status,
  priority
}: ProjectShortcutProps) {
  return (
    <Link href={`projetos/${id}`}>
      <div className="grid grid-cols-3 rounded-md items-center p-3 border mb-1">
        <div className="col-span-2">
          <div className='font-semibold line-clamp-1'>{name}</div>
          <div className='text-xs text-muted-foreground line-clamp-1'>{teams}</div>
        </div>
        <div className='flex text-sm justify-between gap-px'>
          <Status status={status} />
          <Priority priority={priority} />
        </div>
      </div>
    </Link>
  )
}