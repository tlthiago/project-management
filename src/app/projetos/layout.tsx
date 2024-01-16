import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projeto'
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return <div>{children}</div>;
}
