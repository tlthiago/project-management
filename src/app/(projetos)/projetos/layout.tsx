interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export default async function ProjectsLayout({
  children
}: ProjectsLayoutProps) {
  return <div>{children}</div>;
}
