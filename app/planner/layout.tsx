'use client'

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Routes, ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Sidebar } from "../components/sidebar/sidebar";
import { useEffect, useState } from "react";

export default function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const [currentRoute, setCurrentRoute] = useState<Routes>();
    const [parentRoute, setParentRoute] = useState<Routes>();

    const getCurrentRoute = () => {
        ROUTES_LIST.forEach((route) => {
            const currentRoute = route.subItems?.find((route) => route.path === pathName);
            if (currentRoute) {
                setCurrentRoute(currentRoute);
                setParentRoute(route);
            }
        });
    }

    useEffect(() => {
        getCurrentRoute();
    }, []);

    return (
        <>
            <div className="min-h-screen">
                <Sidebar />
                <div className="flex-1 p-6 md:p-8">
                    <Breadcrumbs underline="hover" color="primary">
                        {parentRoute && 
                            <BreadcrumbItem href={parentRoute?.path}>
                                {parentRoute?.labelBreadcrumb || parentRoute?.label}
                            </BreadcrumbItem>
                        }
                        <BreadcrumbItem href={currentRoute?.path} isCurrent>{currentRoute?.label}</BreadcrumbItem>
                    </Breadcrumbs>
                    <div className="mt-6 mb-4">
                        <h1 className="text-3xl">{currentRoute?.label}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}