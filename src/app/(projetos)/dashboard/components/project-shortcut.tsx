import Link from 'next/link';

import Priority from '@/components/priority';
import Status from '@/components/status';

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
      <div className="mb-1 grid grid-cols-3 items-center rounded-md border p-3 hover:border hover:border-neutral-400">
        <div className="col-span-2">
          <div className="line-clamp-1 font-semibold">{name}</div>
          <div className="line-clamp-1 text-xs text-muted-foreground">
            {teams}
          </div>
        </div>
        <div className="flex justify-between gap-px text-sm">
          <Status status={status} />
          <Priority priority={priority} />
        </div>
      </div>
    </Link>
  );
}
