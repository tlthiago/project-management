import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { Navbar } from '@/components/navbar/navbar';
// import { Sidebar } from '@/components/sidebar/sidebar';
import { nextAuthOptions } from '@/utils/authOptions';

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
    <div className="flex min-h-screen flex-col antialiased">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 bg-neutral-100 p-4 dark:bg-neutral-900">
        {children}
      </main>
    </div>
  );
}
