import './globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/react-query';
// import NextAuthSessionProvider from '@/providers/sessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerenciador de projetos',
  description: 'Gerenciador de projetos do Mart Minas'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <NextAuthSessionProvider> */}
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </QueryClientProvider>
        {/* </NextAuthSessionProvider> */}
      </body>
    </html>
  );
}
