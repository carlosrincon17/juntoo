'use client'

import { formatCurrency } from "@/app/lib/currency"
import { Card, CardBody, CardHeader } from "@heroui/react"
import dynamic from "next/dynamic"
import { getNetWorthChartOptions, getSectionsChartOptions } from "../constants/charts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export type SnapshotChartSeries = {
    labels: string[]
    balance: number[]
    savings: number[]
    assets: number[]
    debts: number[]
}

export default function SnapshotsCharts({ series }: { series: SnapshotChartSeries }) {
    const sectionsSeries = [
        { name: "Ahorros", data: series.savings },
        { name: "Patrimonio", data: series.assets },
        { name: "Deudas", data: series.debts },
    ]

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl bg-content1">
                <CardHeader className="pb-0 pt-4 px-6 flex-col items-start border-b border-gray-50/80">
                    <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Patrimonio neto</h4>
                    <small className="text-gray-500 font-medium pb-4">Cómo ha cambiado tu balance global en cada snapshot</small>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <div className="w-full h-[320px]">
                        <Chart
                            options={getNetWorthChartOptions(series.labels)}
                            series={[{ name: "Patrimonio neto", data: series.balance }]}
                            type="area"
                            height={320}
                        />
                    </div>
                </CardBody>
            </Card>

            <Card className="shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl bg-content1">
                <CardHeader className="pb-0 pt-4 px-6 flex-col items-start border-b border-gray-50/80">
                    <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Ahorros, patrimonio y pasivos</h4>
                    <small className="text-gray-500 font-medium pb-4">Evolución de cada sección del consolidado</small>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <div className="w-full h-[320px]">
                        <Chart
                            options={getSectionsChartOptions(series.labels)}
                            series={sectionsSeries}
                            type="line"
                            height={320}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="rounded-xl bg-blue-50/70 px-4 py-3">
                            <p className="text-xs font-medium text-blue-600 mb-1">Último ahorro</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(series.savings.at(-1) ?? 0)}</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50/70 px-4 py-3">
                            <p className="text-xs font-medium text-emerald-600 mb-1">Último patrimonio</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(series.assets.at(-1) ?? 0)}</p>
                        </div>
                        <div className="rounded-xl bg-rose-50/70 px-4 py-3">
                            <p className="text-xs font-medium text-rose-600 mb-1">Últimos pasivos</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(series.debts.at(-1) ?? 0)}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
