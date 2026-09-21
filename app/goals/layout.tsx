'use client'

import { AppShell } from "../components/app-shell";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AppShell>{children}</AppShell>;
}
