"use client"

import type React from "react"
import { Card, CardBody, CardHeader, } from "@heroui/react"
import type {
    FinancialData,
    FinancialStats,
    FinancialDataWithPercentage,
} from "@/app/types/financial"
import { getFinancialOverviewByMonth } from "@/app/actions/expenses"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/lib/currency"
import { FaBuilding, FaChartPie, FaCreditCard, FaWallet } from "react-icons/fa"
import { GraphEskeleton } from "@/app/components/graph-skeleton"


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

const FinancialOverview: React.FC<{ year: number }> = ({ year }) => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const stats = calculateStats(financialData)


    const getFinancialData = async () => {
        setIsLoading(true)
        const financialData = await getFinancialOverviewByMonth(year)
        setFinancialData(financialData)
        setIsLoading(false)
    }

    useEffect(() => {
        getFinancialData()
    }, [year]);

    return (
        <>
            {isLoading ?
                <GraphEskeleton /> :
                <div className="grid grid-cols-1">
                    <Card className="shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl bg-content1 overflow-hidden">
                        <CardHeader className="pb-0 pt-4 px-6 grid grid-cols-1 border-b border-gray-50/80">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 tracking-tight">Resumen Financiero</h3>
                                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                                    <FaChartPie className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500 pb-4">Promedio anual de gastos, ingresos y ahorros</p>
                        </CardHeader>

                        <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden bg-gray-50/30 p-6">
                            <div className="space-y-4">
                                <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <FaWallet className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Ingresos</h5>
                                            <p className="text-xs font-medium text-gray-500">Promedio de ingresos mensuales</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900 tracking-tight">{formatCurrency(stats.avgIncome)}</p>
                                    </div>
                                </div>

                                <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-rose-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-105 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <FaBuilding className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">Gastos</h5>
                                            <p className="text-xs font-medium text-gray-500">Promedio de gastos por mes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900 tracking-tight">{formatCurrency(stats.avgExpenses)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <FaCreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Ahorro</h5>
                                            <p className="text-xs font-medium text-gray-500">Promedio de ahorros por mes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900 tracking-tight">{formatCurrency(stats.avgSavings)}</p>
                                    </div>
                                </div>

                                <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-purple-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <FaCreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Porcentaje ahorrado</h5>
                                            <p className="text-xs font-medium text-gray-500">Promedio de % de ahorros por mes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900 tracking-tight">{stats.avgSavingsPercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            }
        </>
    )
}

export default FinancialOverview

