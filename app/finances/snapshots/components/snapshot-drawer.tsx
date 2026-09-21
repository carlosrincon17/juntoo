'use client'

import { formatCurrency } from "@/app/lib/currency"
import { formatDateTime } from "@/app/lib/dates"
import { ConsolidatedSnapshotDetail } from "@/app/types/consolidated-snapshot"
import { Button, Card, CardBody, ScrollShadow, Skeleton } from "@heroui/react"
import type { ReactNode } from "react"
import { FaBuilding, FaCreditCard, FaTimes, FaWallet } from "react-icons/fa"

interface SnapshotDrawerProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    snapshot: ConsolidatedSnapshotDetail | null
    isLoading: boolean
}

function SectionList({
    title,
    icon,
    accent,
    items,
    emptyLabel,
}: {
    title: string
    icon: ReactNode
    accent: string
    items: { id: number; name: string; value: number; hint?: string }[]
    emptyLabel: string
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
                    {icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            {items.length === 0 ? (
                <p className="text-sm text-gray-400 px-1">{emptyLabel}</p>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => (
                        <Card key={item.id} className="shadow-none border border-gray-100">
                            <CardBody className="py-3 px-4 flex-row items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                    {item.hint ? <p className="text-xs text-gray-400 truncate">{item.hint}</p> : null}
                                </div>
                                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(item.value)}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function SnapshotDrawer({
    isOpen,
    onOpenChange,
    snapshot,
    isLoading,
}: SnapshotDrawerProps) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => onOpenChange(false)}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[28rem] bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">Detalle del snapshot</h2>
                            {snapshot ? (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {formatDateTime(snapshot.createdAt)} · {snapshot.createdByName}
                                </p>
                            ) : null}
                        </div>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={20} />
                        </Button>
                    </div>

                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="p-5 space-y-6">
                            {isLoading || !snapshot ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-20 rounded-2xl" />
                                    <Skeleton className="h-32 rounded-2xl" />
                                    <Skeleton className="h-32 rounded-2xl" />
                                </div>
                            ) : (
                                <>
                                    {snapshot.note ? (
                                        <p className="text-sm text-gray-600 bg-white border border-gray-100 rounded-2xl px-4 py-3">
                                            {snapshot.note}
                                        </p>
                                    ) : null}

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] p-4 text-white col-span-2">
                                            <p className="text-xs uppercase tracking-wide text-white/70">Patrimonio neto</p>
                                            <p className="text-2xl font-semibold mt-1">{formatCurrency(snapshot.totals.balance)}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white border border-gray-100 p-3">
                                            <p className="text-xs text-gray-500">Ahorros</p>
                                            <p className="text-sm font-semibold text-blue-600">{formatCurrency(snapshot.totals.savings)}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white border border-gray-100 p-3">
                                            <p className="text-xs text-gray-500">Patrimonio</p>
                                            <p className="text-sm font-semibold text-emerald-600">{formatCurrency(snapshot.totals.assets)}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white border border-gray-100 p-3 col-span-2">
                                            <p className="text-xs text-gray-500">Pasivos</p>
                                            <p className="text-sm font-semibold text-rose-600">{formatCurrency(snapshot.totals.debts)}</p>
                                        </div>
                                    </div>

                                    <SectionList
                                        title={`Ahorros (${snapshot.totals.savingsCount})`}
                                        icon={<FaWallet className="h-3.5 w-3.5" />}
                                        accent="bg-blue-50 text-blue-500"
                                        emptyLabel="Sin ahorros en este snapshot"
                                        items={snapshot.savings.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            value: item.copValue,
                                            hint: [item.owner, item.currency !== "COP" ? item.currency : null].filter(Boolean).join(" · "),
                                        }))}
                                    />

                                    <SectionList
                                        title={`Patrimonio (${snapshot.totals.assetsCount})`}
                                        icon={<FaBuilding className="h-3.5 w-3.5" />}
                                        accent="bg-emerald-50 text-emerald-500"
                                        emptyLabel="Sin activos en este snapshot"
                                        items={snapshot.patrimonies.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            value: item.value,
                                        }))}
                                    />

                                    <SectionList
                                        title={`Deudas (${snapshot.totals.debtsCount})`}
                                        icon={<FaCreditCard className="h-3.5 w-3.5" />}
                                        accent="bg-rose-50 text-rose-500"
                                        emptyLabel="Sin deudas en este snapshot"
                                        items={snapshot.debts.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            value: item.value,
                                        }))}
                                    />
                                </>
                            )}
                        </div>
                    </ScrollShadow>
                </div>
            </div>
        </>
    )
}
