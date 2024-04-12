import { IconNode } from 'lucide-react';

interface ProjectCardDetailsProps {
  icon: IconNode;
  label: string;
  fieldContent?: string;
}

export function ProjectCardDetails({
  icon,
  label,
  fieldContent
}: ProjectCardDetailsProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
      {fieldContent}
    </div>
  );
}
