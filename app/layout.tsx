import { PrelineScript } from "./components/preline";
import "./globals.css";
import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";

import { Outfit } from 'next/font/google';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: {
        default: "Juntoo - La app para tu familia",
        template: "%s | Juntoo",
    },
    description: "Gestiona las finanzas de tu familia con Juntoo. Controla gastos, ingresos y metas financieras en un solo lugar.",
    icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light" className={`${outfit.variable}`}>
            <body className="font-sans antialiased" suppressHydrationWarning>
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
