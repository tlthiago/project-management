import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projetos'
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return <div>{children}</div>;
}
