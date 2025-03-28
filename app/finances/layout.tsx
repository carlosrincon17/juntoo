'use client'

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { Routes, ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Toaster } from "react-hot-toast";
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
            <div className="min-h-screen  bg-gray-50">
                <Sidebar />
                <div className="flex-1 p-6 md:p-8">
                    <div className="max-w-8xl mx-auto">
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
            <div><Toaster position="top-right"/></div>
        </>
    );
}