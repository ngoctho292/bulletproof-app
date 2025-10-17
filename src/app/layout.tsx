import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import "@/styles/toast.css";
import { ReactQueryProvider } from '@/lib/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';
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
              <SidebarLayout>
                {children}
              </SidebarLayout>
            </ReactQueryProvider>
          </ErrorBoundary>
        </Toasts>
      </body>
    </html>
  );
}