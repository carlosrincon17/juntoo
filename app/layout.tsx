import { PrelineScript } from "./components/preline";
import "./globals.css";
import { Providers } from "./providers";

import { Outfit } from 'next/font/google';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light" className={`${outfit.variable}`}>
            <head>
                <title>Juntoo - La app para tu familia</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="font-outfit">
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
