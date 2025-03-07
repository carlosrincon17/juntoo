"use client"

import type React from "react"
import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"
import { formatCurrency } from "@/app/lib/currency"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface BudgetSimpleProps {
  totalBudget: number
  spent: number
}

const BudgetSimple: React.FC<BudgetSimpleProps> = ({ totalBudget = 3500, spent = 2100 }) => {
    // Calculate remaining and percentage
    const remaining = totalBudget - spent
    const percentageUsed = Math.round((spent / totalBudget) * 100)
    const percentageRemaining = 100 - percentageUsed

    // Donut chart options
    const donutChartOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
        },
        labels: ["Gastado", "Disponible"],
        colors: ["#ef4444", "#22c55e"],
        legend: {
            position: "bottom",
            fontWeight: 600,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "16px",
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: "22px",
                            fontWeight: 700,
                            formatter: (val) => `$${Number(val).toLocaleString()}`,
                        },
                        total: {
                            show: true,
                            label: "Total",
                            fontSize: "16px",
                            fontWeight: 600,
                            formatter: () => `$${totalBudget.toLocaleString()}`,
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: (val) => `$${Number(val).toLocaleString()}`,
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 300,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    }

    return (
        <div className="w-full max-w-7xl mx-auto mt-4">
            <Card className="p-4">
                <CardHeader className="flex flex-col items-start pb-0">
                    <h2 className="text-xl font-semibold">Presupuesto Mensual</h2>
                    <p className="text-default-500 text-sm">Visualización de gastos vs presupuesto</p>
                </CardHeader>

                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chart */}
                        <div className="flex items-center justify-center">
                            {typeof window !== "undefined" && (
                                <Chart options={donutChartOptions} series={[spent, remaining]} type="donut" height={300} />
                            )}
                        </div>

                        <div className="flex flex-col justify-center space-y-6 mt-4">

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Presupuesto Total</span>
                                        <span className="text-sm font-medium">{formatCurrency(totalBudget)}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Gastado</span>
                                        <span className="text-sm font-medium text-red-500">{formatCurrency(spent)}</span>
                                    </div>
                                    <Progress
                                        value={percentageUsed}
                                        color="danger"
                                        size="md"
                                        showValueLabel={true}
                                        className="max-w-md"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Disponible</span>
                                        <span className="text-sm font-medium text-green-500">${remaining.toLocaleString()}</span>
                                    </div>
                                    <Progress
                                        value={percentageRemaining}
                                        color="success"
                                        size="md"
                                        showValueLabel={true}
                                        className="max-w-md"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">Resumen</h3>
                                <p className="text-sm text-gray-600">
                  Has utilizado el <span className="font-semibold">{percentageUsed}%</span> de tu presupuesto mensual.
                                    {percentageUsed > 90
                                        ? " ¡Cuidado! Estás cerca de agotar tu presupuesto."
                                        : percentageUsed > 75
                                            ? " Estás utilizando tu presupuesto a buen ritmo."
                                            : " Vas bien, tienes suficiente presupuesto disponible."}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default BudgetSimple

