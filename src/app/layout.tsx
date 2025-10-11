import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import "@/styles/toast.css";
import { ReactQueryProvider } from '@/lib/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/layouts/header';
import { Toasts } from '@/components/ui/toast';

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
        <Toasts>
          <ErrorBoundary>
            <ReactQueryProvider>
              <Header />
              <main>{children}</main>
            </ReactQueryProvider>
          </ErrorBoundary>
        </Toasts>
      </body>
    </html>
  );
}