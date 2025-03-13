"use client"

import type React from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import dynamic from "next/dynamic"
import type {
    FinancialData,
    FinancialStats,
    ChartData,
    FinancialDataWithPercentage,
} from "@/app/types/financial"
import { getFinancialOverviewByMonth } from "@/app/actions/expenses"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/lib/currency"
import { getAreaChartOptionsMonthly, getBarChartOptionsSavings } from "../constants/charts"
import Kpi from "../../components/kpi"
import { CustomLoading } from "@/app/components/customLoading"


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const calculateStats = (data: FinancialData[]): FinancialStats => {
    const totalMonths = data.length

    const totalExpenses = data.reduce((sum, month) => sum + month.expenses, 0)
    const totalIncome = data.reduce((sum, month) => sum + month.income, 0)
    const totalSavings = data.reduce((sum, month) => sum + month.savings, 0)

    const avgExpenses = Math.round(totalExpenses / totalMonths)
    const avgIncome = Math.round(totalIncome / totalMonths)
    const avgSavings = Math.round(totalSavings / totalMonths)
    const avgSavingsPercentage = Math.round((avgSavings / avgIncome) * 100)

    // Calculate savings percentage for each month
    const dataWithPercentage: FinancialDataWithPercentage[] = data.map((month) => ({
        ...month,
        savingsPercentage: Math.round((month.savings / month.income) * 100),
    }))

    return {
        avgExpenses,
        avgIncome,
        avgSavings,
        avgSavingsPercentage,
        dataWithPercentage,
    }
}

const formatChartData = (data: FinancialData[]): ChartData => {
    const months = data.map((item) => item.month)

    const series = [
        {
            name: "Ingresos",
            data: data.map((item) => item.income),
        },
        {
            name: "Gastos",
            data: data.map((item) => item.expenses),
        },
        {
            name: "Ahorros",
            data: data.map((item) => item.savings),
        },
    ]

    const savingsPercentageSeries = [
        {
            name: "% Ahorro",
            data: data.map((item) => Math.round((item.savings / item.income) * 100)),
        },
    ]

    return { months, series, savingsPercentageSeries }
}

const FinancialOverview: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const stats = calculateStats(financialData)
    const { months, series, savingsPercentageSeries } = formatChartData(financialData)


    const getFinancialData = async ()  => {
        const financialData = await getFinancialOverviewByMonth()
        setFinancialData(financialData)
        setIsLoading(false)
    }

    useEffect(() => {
        getFinancialData()
    }, []);

    return (
        <>
            { isLoading ? 
                <CustomLoading message="Preparando estadísticas" /> :
                <div className="w-full mx-auto space-y-6">
                    <h1 className="text-2xl font-light mb-6">Estadisticas mensuales</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <Kpi title="Prom. Ingresos" value={stats.avgIncome} color="text-green-500" />
                        <Kpi title="Prom. Gastos" value={stats.avgExpenses} color="text-red-500" />
                        <Kpi title="Prom. Ahorro" value={stats.avgSavings} color="text-blue-500" />
                        <Kpi title="Porcentaje de ahorro" value={stats.avgSavingsPercentage} color="text-purple-500" type="percentage" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 mt-8">
                        <Card className="shadow-md">
                            <CardHeader className="pb-0 pt-4 flex-col items-start">
                                <h4 className="text-lg font-medium">Vista de mes a mes</h4>
                                <small className="text-default-500">Ingresos, gastos y ahorros de los últimos 12 meses</small>
                            </CardHeader>
                            <CardBody className="overflow-hidden">
                                <div className="w-full h-[300px]">
                                    {typeof window !== "undefined" && (
                                        <Chart options={getAreaChartOptionsMonthly(months)} series={series} type="area" height={300} />
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader className="pb-0 pt-4 flex-col items-start">
                                <h4 className="text-lg font-medium">Porcentaje ahorrado</h4>
                                <small className="text-default-500">Porcentaje de los ingresos no gastados</small>
                            </CardHeader>
                            <CardBody className="overflow-hidden">
                                <div className="w-full h-[300px]">
                                    {typeof window !== "undefined" && (
                                        <Chart options={getBarChartOptionsSavings(months)} series={savingsPercentageSeries} type="bar" height={300} />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Monthly Data Table */}
                    <Card className="shadow-md mt-6">
                        <CardHeader className="pb-0 pt-4 px-4">
                            <h4 className="text-lg font-medium">Breakdown mensual</h4>
                        </CardHeader>
                        <CardBody>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Mes</th>
                                            <th className="text-right py-3 px-4">Ingresos</th>
                                            <th className="text-right py-3 px-4">Gastos</th>
                                            <th className="text-right py-3 px-4">Ahorros</th>
                                            <th className="text-right py-3 px-4">% Ahorrado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.dataWithPercentage.map((month, index) => (
                                            <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">{month.month}</td>
                                                <td className="text-right py-3 px-4 text-green-600">{formatCurrency(month.income)}</td>
                                                <td className="text-right py-3 px-4 text-red-600">{formatCurrency(month.expenses)}</td>
                                                <td className="text-right py-3 px-4 text-blue-600">{formatCurrency(month.savings)}</td>
                                                <td className="text-right py-3 px-4 text-purple-600">{month.savingsPercentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            }
        </>
    )
}

export default FinancialOverview

