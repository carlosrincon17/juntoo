'use client'

import StorageManager from "@/utils/storage/manager";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export default function Layout() {
  return (
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
            Prespuestos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page" className="text-stale-50">
            Ingresos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page" className="text-stale-50">
            Ingresos
          </Link>
        </NavbarItem>

      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
        {StorageManager.getSelectedUser()}
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Salir
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}