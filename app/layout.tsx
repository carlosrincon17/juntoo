import { PrelineScript } from "./components/preline";
import "./globals.css";
import { Providers } from "./providers";

import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light" className={`${poppins.variable}`}>
            <head>
                <title>Juntoo - La app para tu familia</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="font-poppins">
                <Providers>
                    <main>
                        {children}
                    </main>
                </Providers>
                <PrelineScript />
            </body>
        </html>
    );
}
