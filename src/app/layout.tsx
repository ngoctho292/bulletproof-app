import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/layouts/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulletproof React App',
  description: 'A scalable React application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ReactQueryProvider>
            <Header />
            <main>{children}</main>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}