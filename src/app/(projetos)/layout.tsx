import { getServerSession } from 'next-auth';
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

import { Sidebar } from '@/components/sidebar/sidebar';

export default async function ProjectsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen grid-cols-app">
      <Sidebar />
      <main className='px-4 pb-12 pt-6'>{children}</main>
    </div>
  );
}
