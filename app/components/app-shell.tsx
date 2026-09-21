'use client'

import type { ReactNode } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Routes, ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Sidebar } from "./sidebar/sidebar";

function getBreadcrumbRoutes(pathname: string) {
    let currentRoute: Routes | undefined;
    let parentRoute: Routes | undefined;

    for (const route of ROUTES_LIST) {
        const match = route.subItems?.find((item) => item.path === pathname);
        if (match) {
            currentRoute = match;
            parentRoute = route;
            break;
        }
    }

    return { currentRoute, parentRoute };
}

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname() ?? "";
    const { currentRoute, parentRoute } = getBreadcrumbRoutes(pathname);

    return (
        <div className="min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="lg:ps-72">
                <div className="mx-auto max-w-[85rem] space-y-6 p-4 sm:p-6 lg:p-8">
                    <Breadcrumbs underline="hover" color="primary">
                        {parentRoute ? (
                            <BreadcrumbItem href={parentRoute.path}>
                                {parentRoute.labelBreadcrumb || parentRoute.label}
                            </BreadcrumbItem>
                        ) : null}
                        <BreadcrumbItem href={currentRoute?.path} isCurrent>
                            {currentRoute?.label}
                        </BreadcrumbItem>
                    </Breadcrumbs>
                    {children}
                </div>
            </div>
        </div>
    );
}
