'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { logout, getUser } from "../actions/auth";
import { useEffect, useState } from "react";

export default function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [user, setUser] = useState("--");

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

    return (
        <>
            <Navbar position="static">
                <NavbarBrand>
                    <p className="font-bold text-inherit">Cashly</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive>
                        <Link href="/dashboard" aria-current="page" className="text-stale-50">
                            Dashboard
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="#" aria-current="page" className="text-stale-50">
                            Gastos
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="#" aria-current="page" className="text-stale-50">
                            Ingresos
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="#" aria-current="page" className="text-stale-50">
                            Presupuestos
                        </Link>
                    </NavbarItem>

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
            <div className="pt-16 min-h-screen flex justify-center bg-gray-900">
                <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg">
                    {children}
                </div>
            </div>
            
        </>
    );
}