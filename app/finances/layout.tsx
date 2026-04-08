'use client'

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Routes, ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Sidebar } from "../components/sidebar/sidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();

    let currentRoute: Routes | undefined;
    let parentRoute: Routes | undefined;

    for (const route of ROUTES_LIST) {
        const match = route.subItems?.find((r) => r.path === pathName);
        if (match) {
            currentRoute = match;
            parentRoute = route;
            break;
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
            <Sidebar />

            {/* Main Content Wrapper - Push right on desktop */}
            <div className="w-full lg:ps-64">
                <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    <div className="max-w-[85rem] mx-auto">
                        <Breadcrumbs underline="hover" color="primary" className="mb-6">
                            {parentRoute &&
                                <BreadcrumbItem href={parentRoute?.path}>
                                    {parentRoute?.labelBreadcrumb || parentRoute?.label}
                                </BreadcrumbItem>
                            }
                            <BreadcrumbItem href={currentRoute?.path} isCurrent>{currentRoute?.label}</BreadcrumbItem>
                        </Breadcrumbs>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}