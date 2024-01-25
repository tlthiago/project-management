import { Sidebar } from '@/components/sidebar/sidebar';

export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-app">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
