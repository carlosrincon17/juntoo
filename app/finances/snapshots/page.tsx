'use client'

import { CustomLoading } from "@/app/components/customLoading"
import ConfirmModal from "@/app/components/confirmModal"
import { formatCurrency } from "@/app/lib/currency"
import { formatChartDate, formatDateTime } from "@/app/lib/dates"
import {
    ConsolidatedSnapshotDetail,
    ConsolidatedSnapshotListItem,
    SnapshotTotals,
} from "@/app/types/consolidated-snapshot"
import { Button, Card, CardBody, useDisclosure } from "@heroui/react"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { FaBuilding, FaCamera, FaChartLine, FaCreditCard, FaTrash, FaWallet } from "react-icons/fa"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6"
import { deleteConsolidatedSnapshot, getConsolidatedSnapshotById, getConsolidatedSnapshots } from "./actions/snapshots"
import SnapshotDrawer from "./components/snapshot-drawer"
import SnapshotsCharts from "./components/snapshots-charts"
import TakeSnapshotModal from "./components/take-snapshot-modal"

type MetricKey = "balance" | "savings" | "assets" | "debts"

type Delta = {
    amount: number
    percentage: number
}

function getDelta(current: number, previous?: number): Delta | null {
    if (previous === undefined) {
        return null
    }

    const amount = current - previous
    const percentage = previous === 0
        ? (current === 0 ? 0 : 100)
        : (amount / Math.abs(previous)) * 100

    return { amount, percentage }
}

function DeltaBadge({ delta, invert }: { delta: Delta | null; invert?: boolean }) {
    if (!delta) {
        return <span className="text-xs font-medium text-gray-400">Primer registro</span>
    }

    const isPositive = invert ? delta.amount < 0 : delta.amount > 0
    const isNeutral = delta.amount === 0
    const color = isNeutral
        ? "text-gray-500 bg-gray-50"
        : isPositive
            ? "text-emerald-600 bg-emerald-50"
            : "text-rose-600 bg-rose-50"
    const Icon = delta.amount >= 0 ? FaChevronUp : FaChevronDown

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
            <Icon className="h-3 w-3" />
            {Math.abs(Math.round(delta.percentage))}%
            <span className="opacity-70">({formatCurrency(delta.amount)})</span>
        </span>
    )
}

function MetricCard({
    title,
    value,
    delta,
    invert,
    icon,
    accent,
}: {
    title: string
    value: number
    delta: Delta | null
    invert?: boolean
    icon: ReactNode
    accent: string
}) {
    return (
        <Card className="shadow-sm border border-gray-100 rounded-2xl bg-content1">
            <CardBody className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accent}`}>
                        {icon}
                    </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 tracking-tight">{formatCurrency(value)}</p>
                <div className="mt-2">
                    <DeltaBadge delta={delta} invert={invert} />
                </div>
            </CardBody>
        </Card>
    )
}

export default function Page() {
    const [snapshots, setSnapshots] = useState<ConsolidatedSnapshotListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDetail, setSelectedDetail] = useState<ConsolidatedSnapshotDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [snapshotToDelete, setSnapshotToDelete] = useState<ConsolidatedSnapshotListItem | null>(null)
    const { isOpen: isTakeOpen, onOpen: onTakeOpen, onOpenChange: onTakeOpenChange } = useDisclosure()
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

    const loadSnapshots = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true)
        }
        try {
            const data = await getConsolidatedSnapshots()
            setSnapshots(data)
        } catch (error) {
            console.error("Error fetching snapshots", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSnapshots()
    }, [])

    const chronological = useMemo(
        () => [...snapshots].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        [snapshots],
    )

    const latest = chronological.at(-1)
    const previous = chronological.at(-2)
    const latestTotals: SnapshotTotals | undefined = latest?.totals
    const previousTotals = previous?.totals

    const chartSeries = useMemo(() => ({
        labels: chronological.map((item) => formatChartDate(item.createdAt)),
        balance: chronological.map((item) => item.totals.balance),
        savings: chronological.map((item) => item.totals.savings),
        assets: chronological.map((item) => item.totals.assets),
        debts: chronological.map((item) => item.totals.debts),
    }), [chronological])

    const deltas: Record<MetricKey, Delta | null> = {
        balance: getDelta(latestTotals?.balance ?? 0, previousTotals?.balance),
        savings: getDelta(latestTotals?.savings ?? 0, previousTotals?.savings),
        assets: getDelta(latestTotals?.assets ?? 0, previousTotals?.assets),
        debts: getDelta(latestTotals?.debts ?? 0, previousTotals?.debts),
    }

    const openSnapshot = async (id: number) => {
        setDetailLoading(true)
        onDrawerOpen()
        try {
            const detail = await getConsolidatedSnapshotById(id)
            setSelectedDetail(detail)
        } catch (error) {
            console.error("Error fetching snapshot detail", error)
            setSelectedDetail(null)
        } finally {
            setDetailLoading(false)
        }
    }

    const confirmDelete = async (onClose: () => void) => {
        if (!snapshotToDelete) {
            onClose()
            return
        }

        await deleteConsolidatedSnapshot(snapshotToDelete.id)
        setSnapshotToDelete(null)
        onClose()
        await loadSnapshots(false)
    }

    if (loading) {
        return <CustomLoading />
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <FaChartLine className="text-indigo-600" /> Evolución
                    </h1>
                    <p className="text-gray-500 font-light text-sm max-w-2xl">
                        Snapshots del consolidado para ver cómo cambia tu patrimonio neto, ahorros y pasivos en el tiempo.
                    </p>
                </div>
                <Button color="primary" onPress={onTakeOpen} startContent={<FaCamera />} className="shadow-md shadow-indigo-200">
                    Tomar snapshot
                </Button>
            </div>

            {snapshots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-indigo-500 text-2xl">
                        <FaCamera />
                    </div>
                    <h3 className="text-gray-900 font-medium text-lg">Aún no hay snapshots</h3>
                    <p className="text-gray-400 text-sm mt-1 mb-6 max-w-sm">
                        Toma el primero para congelar el estado actual del consolidado y empezar a ver la evolución.
                    </p>
                    <Button color="primary" variant="flat" onPress={onTakeOpen} startContent={<FaCamera />}>
                        Crear primer snapshot
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <MetricCard
                            title="Patrimonio neto"
                            value={latestTotals?.balance ?? 0}
                            delta={deltas.balance}
                            icon={<FaChartLine className="h-4 w-4" />}
                            accent="bg-indigo-50 text-indigo-500"
                        />
                        <MetricCard
                            title="Ahorros"
                            value={latestTotals?.savings ?? 0}
                            delta={deltas.savings}
                            icon={<FaWallet className="h-4 w-4" />}
                            accent="bg-blue-50 text-blue-500"
                        />
                        <MetricCard
                            title="Patrimonio"
                            value={latestTotals?.assets ?? 0}
                            delta={deltas.assets}
                            icon={<FaBuilding className="h-4 w-4" />}
                            accent="bg-emerald-50 text-emerald-500"
                        />
                        <MetricCard
                            title="Pasivos"
                            value={latestTotals?.debts ?? 0}
                            delta={deltas.debts}
                            invert
                            icon={<FaCreditCard className="h-4 w-4" />}
                            accent="bg-rose-50 text-rose-500"
                        />
                    </div>

                    {chronological.length === 1 ? (
                        <Card className="shadow-sm border border-dashed border-indigo-100 rounded-2xl bg-indigo-50/40">
                            <CardBody className="p-6 text-sm text-indigo-700">
                                Con un segundo snapshot aquí vas a ver las gráficas de evolución. El primero ya quedó como punto de partida.
                            </CardBody>
                        </Card>
                    ) : (
                        <SnapshotsCharts series={chartSeries} />
                    )}

                    <Card className="shadow-sm border border-gray-100 rounded-2xl bg-content1 overflow-hidden">
                        <CardBody className="p-0">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-lg text-gray-900 tracking-tight">Snapshots</h3>
                                <p className="text-sm text-gray-500">Del más reciente al más antiguo</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Fecha</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Patrimonio neto</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Ahorros</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Patrimonio</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Pasivos</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {snapshots.map((snapshot, index) => {
                                            const older = snapshots[index + 1]
                                            const balanceDelta = getDelta(snapshot.totals.balance, older?.totals.balance)

                                            return (
                                                <tr
                                                    key={snapshot.id}
                                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                                                    onClick={() => openSnapshot(snapshot.id)}
                                                >
                                                    <td className="py-3 px-4">
                                                        <p className="font-medium text-gray-800">{formatDateTime(snapshot.createdAt)}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {snapshot.createdByName}{snapshot.note ? ` · ${snapshot.note}` : ""}
                                                        </p>
                                                    </td>
                                                    <td className="text-right py-3 px-4">
                                                        <p className="font-semibold text-indigo-700">{formatCurrency(snapshot.totals.balance)}</p>
                                                        <div className="mt-1 flex justify-end">
                                                            <DeltaBadge delta={balanceDelta} />
                                                        </div>
                                                    </td>
                                                    <td className="text-right py-3 px-4 font-medium text-blue-600">{formatCurrency(snapshot.totals.savings)}</td>
                                                    <td className="text-right py-3 px-4 font-medium text-emerald-600">{formatCurrency(snapshot.totals.assets)}</td>
                                                    <td className="text-right py-3 px-4 font-medium text-rose-600">{formatCurrency(snapshot.totals.debts)}</td>
                                                    <td className="text-right py-3 px-4">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            color="danger"
                                                            onPress={() => {
                                                                setSnapshotToDelete(snapshot)
                                                                onDeleteOpen()
                                                            }}
                                                            onClick={(event) => event.stopPropagation()}
                                                        >
                                                            <FaTrash size={12} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}

            <TakeSnapshotModal isOpen={isTakeOpen} onOpenChange={onTakeOpenChange} onSaved={() => loadSnapshots(false)} />
            <SnapshotDrawer
                isOpen={isDrawerOpen}
                onOpenChange={() => {
                    onDrawerOpenChange()
                    if (isDrawerOpen) {
                        setSelectedDetail(null)
                    }
                }}
                snapshot={selectedDetail}
                isLoading={detailLoading}
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                title="Eliminar snapshot"
                message="Esta foto del consolidado se va a borrar. No afecta tus ahorros, deudas ni patrimonio actuales."
                onConfirm={confirmDelete}
            />
        </div>
    )
}
