import { PrelineScript } from "./components/preline";
import "./globals.css";
import { Providers } from "./providers";

import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <body>
                <Providers>
                    <main className={`${inter.variable} font-sans`}>
                        {children}
                    </main>
                </Providers>
                <PrelineScript />
            </body>
        </html>
    );
}
