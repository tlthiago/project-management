import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projetos'
};

interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export default async function ProjectsLayout({ children }: ProjectsLayoutProps) {
  return <div>{children}</div>;
}
