'use client'

import { ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { Header, Label, ListBox, Separator } from "@heroui-v3/react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Fragment } from "react";
import {
    FaBullseye,
    FaCalendarAlt,
    FaChartBar,
    FaChartLine,
    FaChartPie,
    FaExchangeAlt,
    FaIdCard,
    FaRedo,
    FaTags,
    FaTasks,
    FaUser,
    FaUsers,
    FaWallet,
} from "react-icons/fa";

const SECTION_ICONS: Record<string, ReactNode> = {
    Finanzas: <FaChartPie className="size-3.5" />,
    Metas: <FaBullseye className="size-3.5" />,
    Planificación: <FaTasks className="size-3.5" />,
};

const ITEM_ICONS: Record<string, ReactNode> = {
    "/finances": <FaChartPie className="size-4" />,
    "/finances/savings": <FaWallet className="size-4" />,
    "/finances/snapshots": <FaChartLine className="size-4" />,
    "/finances/summary": <FaChartBar className="size-4" />,
    "/finances/categories": <FaTags className="size-4" />,
    "/finances/goals": <FaBullseye className="size-4" />,
    "/finances/transactions": <FaExchangeAlt className="size-4" />,
    "/finances/periodic-payments": <FaRedo className="size-4" />,
    "/goals": <FaChartLine className="size-4" />,
    "/goals/family": <FaUsers className="size-4" />,
    "/goals/personal": <FaUser className="size-4" />,
    "/planner": <FaCalendarAlt className="size-4" />,
    "/planner/ids": <FaIdCard className="size-4" />,
};

function getSelectedPath(pathname: string): string {
    const matches = ROUTES_LIST
        .flatMap((section) => section.subItems ?? [section])
        .map((item) => item.path)
        .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
        .sort((a, b) => b.length - a.length);

    return matches[0] ?? pathname;
}

interface NavMenuItemsProps {
    onNavigate?: () => void;
}

export const NavMenuItems = ({ onNavigate }: NavMenuItemsProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const selectedPath = getSelectedPath(pathname ?? "");

    const handleSelectionChange = (keys: "all" | Set<string | number>) => {
        if (keys === "all") {
            return;
        }

        const key = [...keys][0];
        if (key === undefined) {
            return;
        }

        router.push(String(key));
        onNavigate?.();
    };

    return (
        <ListBox
            aria-label="Navegación principal"
            className="w-full gap-1 bg-transparent p-0 shadow-none"
            selectionMode="single"
            selectedKeys={new Set([selectedPath])}
            onSelectionChange={handleSelectionChange}
        >
            {ROUTES_LIST.map((section, index) => (
                <Fragment key={section.label}>
                    {index > 0 ? <Separator className="my-2" /> : null}
                    <ListBox.Section>
                        <Header className="flex items-center gap-2 px-2 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            <span className="text-zinc-400">{SECTION_ICONS[section.label]}</span>
                            {section.label}
                        </Header>
                        {(section.subItems ?? [section]).map((item) => (
                            <ListBox.Item
                                key={item.path}
                                id={item.path}
                                textValue={item.label}
                                className="my-0.5 rounded-xl px-2.5 py-2"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                                    {ITEM_ICONS[item.path]}
                                </span>
                                <Label className="font-medium">{item.label}</Label>
                            </ListBox.Item>
                        ))}
                    </ListBox.Section>
                </Fragment>
            ))}
        </ListBox>
    );
};
