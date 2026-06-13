import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { AppLayout } from '@/components/layout/app-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'World Cup 2026 Dashboard | Live Scores, Fixtures & Standings',
  description: 'Track FIFA World Cup 2026 live scores, fixtures, standings, and match details. Real-time updates powered by ScoreBat.',
  keywords: ['World Cup 2026', 'FIFA', 'Live Score', 'Football', 'Soccer', 'Dashboard'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
