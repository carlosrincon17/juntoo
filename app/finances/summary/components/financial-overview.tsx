"use client"

import type React from "react"
import { Card, CardBody, CardHeader } from "@heroui/react"
import dynamic from "next/dynamic"
import type {
    FinancialData,
    FinancialStats,
    ChartData,
    FinancialDataWithPercentage,
    FinancialCategoryData,
} from "@/app/types/financial"
import { getExpensesByParentCategory, getFinancialOverviewByMonth } from "@/app/actions/expenses"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/lib/currency"
import { getAreaChartOptionsMonthly, getBarChartOptionsSavings, getAreaChartOptionsMonthlyCategory } from "../constants/charts"
import { CustomLoading } from "@/app/components/customLoading"
import { FaBuilding, FaChartPie, FaCreditCard, FaWallet } from "react-icons/fa"


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

const formatChatCategoriesData = (data: FinancialCategoryData[]): ChartData => {
    const months = data?.[0]?.totalsByMonth.map((item) => item.month)
    const series = data.map((item) => {
        return {
            name: item.categoryParent,
            data: item.totalsByMonth.map((totalByMonth) => totalByMonth.total),
        }
    })
    return { months, series, savingsPercentageSeries: [] }
}



const FinancialOverview: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [financialCategoryData, setFinancialCategoryData] = useState<FinancialCategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const stats = calculateStats(financialData)
    const { months, series, savingsPercentageSeries } = formatChartData(financialData)
    const { months: monthsByCategory, series: seriesByCategory } = formatChatCategoriesData(financialCategoryData)


    const getFinancialData = async ()  => {
        const financialData = await getFinancialOverviewByMonth()
        const expensesByCategoryParent = await getExpensesByParentCategory()
        setFinancialCategoryData(expensesByCategoryParent)
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
                    <Card className="border-none rounded-3xl shadow-[0_10px_40px_-15px_rgba(90,107,255,0.15)] overflow-hidden xl:col-span-2">
                        <div className="bg-gradient-to-br from-white to-[#f9faff]">
                            <div className="p-6 border-b border-[#f0f4ff]">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg text-[#121432] tracking-tight">Resumen Financiero</h3>
                                    <div className="p-2 rounded-full bg-gradient-to-r from-[#5a6bff]/10 to-[#a78bfa]/10">
                                        <FaChartPie className="h-4 w-4 text-[#5a6bff]" />
                                    </div>
                                </div>
                                <p className="text-sm font-light text-[#121432]/60">Promedio anual de gastos, ingresos y ahorros</p>
                            </div>
        
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        
                                <div className="space-y-4">
        
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#5a6bff]/5 to-[#818cf8]/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a6bff] to-[#818cf8] flex items-center justify-center">
                                                <FaWallet className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-[#121432]">Ingresos</h5>
                                                <p className="text-xs font-light text-[#121432]/60">Promedio de ingresos mensuales</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-light text-[#121432]">{formatCurrency(stats.avgIncome)}</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="text-xs font-normal text-[#5a6bff]"></p>
                                            </div>
                                        </div>
                                    </div>
        
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2dd4bf]/5 to-[#34d399]/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2dd4bf] to-[#34d399] flex items-center justify-center">
                                                <FaBuilding className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-[#121432]">Gastos</h5>
                                                <p className="text-xs font-light text-[#121432]/60">Promedio de gastos por mes</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-light text-[#121432]">{formatCurrency(stats.avgExpenses)}</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="text-xs font-normal text-[#2dd4bf]"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f97066]/5 to-[#fb7185]/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97066] to-[#fb7185] flex items-center justify-center">
                                                <FaCreditCard className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-[#121432]">Ahorro</h5>
                                                <p className="text-xs font-light text-[#121432]/60">Promedio de ahorros por mes</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-light text-[#121432]">{formatCurrency(stats.avgSavings)}</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="text-xs font-normal text-[#f97066]"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f97066]/5 to-[#fb7185]/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97066] to-[#fb7185] flex items-center justify-center">
                                                <FaCreditCard className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-[#121432]">Pocentaje ahorrado</h5>
                                                <p className="text-xs font-light text-[#121432]/60">Promedio de porcentaje de ahorros por mes</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-light text-[#121432]">{stats.avgSavingsPercentage} %</p>
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="text-xs font-normal text-[#f97066]"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
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
                                <h4 className="text-lg font-medium">Vista de mes a mes</h4>
                                <small className="text-default-500">Ingresos, gastos y ahorros de los últimos 12 meses</small>
                            </CardHeader>
                            <CardBody className="overflow-hidden">
                                <div className="w-full h-[300px]">
                                    {typeof window !== "undefined" && (
                                        <Chart options={getAreaChartOptionsMonthlyCategory(monthsByCategory)} series={seriesByCategory} type="line" height={300} />
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

