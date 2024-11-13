'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Breadcrumbs, BreadcrumbItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { logout, getUser } from "../actions/auth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Toaster } from "react-hot-toast";

export default function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const [user, setUser] = useState("--");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    async function getUserData() {
        const userData = await getUser();
        setUser(userData);
    }

    useEffect(() => {
        getUserData();
    }, []);

    const onLogoutClick = () => {
        logout()
    }

    const checkIsActive = (path: string) => {
        return pathName === path;
    }

    const getNamBarItems = () => {
        return ROUTES_LIST.map((route) => {
            return (
                <NavbarItem key={route.path} isActive={checkIsActive(route.path)}>
                    <Link href={route.path} aria-current="page" className="text-stale-50">
                        {route.label}
                    </Link>
                </NavbarItem>
            )
        })
    }

    const getToggleNamBarItems = () => {
        return ROUTES_LIST.map((route) => {
            return (
                <NavbarMenuItem key={route.path} isActive={checkIsActive(route.path)}>
                    <Link
                        color={checkIsActive(route.path) ? "primary" : "foreground"}
                        className="w-full"
                        size="lg"
                        href={route.path}
                    >
                        {route.label}
                    </Link>
                </NavbarMenuItem>
            )
        })
    }

    const getCurrentRoute = () => {
        return ROUTES_LIST.find((route) => route.path === pathName);
    }

    const getParentRoute = () => {
        return ROUTES_LIST.find((route) => route.path === getCurrentRoute()?.parent);
    }

    return (
        <>
            <Navbar position="static" 
                isBordered 
                onMenuOpenChange={setIsMenuOpen}
                classNames={{
                    item: [
                        "flex",
                        "relative",
                        "h-full",
                        "items-center",
                        "data-[active=true]:after:content-['']",
                        "data-[active=true]:after:absolute",
                        "data-[active=true]:after:bottom-0",
                        "data-[active=true]:after:left-0",
                        "data-[active=true]:after:right-0",
                        "data-[active=true]:after:h-[2px]",
                        "data-[active=true]:after:rounded-[2px]",
                        "data-[active=true]:after:bg-primary",
                    ],
                }}> 
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <p className="font-bold text-inherit">Cashly</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarMenu>
                    {getToggleNamBarItems()}
                </NavbarMenu>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {getNamBarItems()}
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                        {user}
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" variant="flat" onClick={onLogoutClick}>
                            Salir
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="min-h-screen flex justify-center bg-slate-100">
                <div className="w-full max-w-6xl p-8 bg-slate-50 text-stone-800">
                    <Breadcrumbs underline="hover" color="primary">
                        {getParentRoute() && 
                            <BreadcrumbItem href={getParentRoute()?.path}>
                                {getParentRoute()?.labelBreadcrumb || getParentRoute()?.label}
                            </BreadcrumbItem>
                        }
                        <BreadcrumbItem href={getCurrentRoute()?.path} isCurrent>{getCurrentRoute()?.label}</BreadcrumbItem>
                    </Breadcrumbs>
                    <div className="mt-6 mb-4">
                        <h1 className="text-3xl">{getCurrentRoute()?.label}</h1>
                    </div>
                    {children}
                </div>
            </div>
            <div><Toaster position="top-right"/></div>
        </>
    );
}