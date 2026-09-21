'use client'

import { logout } from "../../actions/auth";
import { NavTitle } from "./navTitle";
import { NavMenuItems } from "./navMenuItems";
import { Button, Drawer, Separator, useOverlayState } from "@heroui-v3/react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="px-5 pb-4 pt-5">
                <NavTitle />
                <p className="mt-2 text-xs font-medium text-zinc-400">Finanzas en familia</p>
            </div>
            <Separator />
            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <NavMenuItems onNavigate={onNavigate} />
            </nav>
            <div className="border-t border-zinc-100 p-3">
                <Button
                    fullWidth
                    variant="secondary"
                    className="justify-center"
                    onPress={() => logout()}
                >
                    <FaSignOutAlt className="size-4" />
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );
}

export const Sidebar = () => {
    const mobileMenu = useOverlayState();

    return (
        <>
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
                <NavTitle />
                <Drawer>
                    <Button
                        isIconOnly
                        aria-label="Abrir menú"
                        size="sm"
                        variant="tertiary"
                        onPress={mobileMenu.open}
                    >
                        <FaBars className="size-4" />
                    </Button>
                    <Drawer.Backdrop isOpen={mobileMenu.isOpen} onOpenChange={mobileMenu.setOpen}>
                        <Drawer.Content className="w-[18.5rem] max-w-[85vw]" placement="left">
                            <Drawer.Dialog className="h-full p-0">
                                <Drawer.CloseTrigger />
                                <SidebarBody onNavigate={mobileMenu.close} />
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </header>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-200/80 bg-white lg:flex lg:flex-col">
                <SidebarBody />
            </aside>
        </>
    );
};
