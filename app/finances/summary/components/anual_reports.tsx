"use client"

import type React from "react"
import { Card, CardBody, CardHeader, Select, SelectItem, SharedSelection } from "@heroui/react"
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
import { GraphEskeleton } from "@/app/components/graph-skeleton"


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

const formatChatCategoryData = (data: FinancialCategoryData[], categoryParent: string): ChartData => {
    const months = data?.find(
        (item) => item.categoryParent === categoryParent
    )?.totalsByMonth.map((item) => item.month) || []
    const series = data.filter(
        item => item.categoryParent === categoryParent
    ).map((item) => {
        return {
            name: item.categoryParent,
            data: item.totalsByMonth.map((totalByMonth) => totalByMonth.total),
        }
    })
    return { months, series, savingsPercentageSeries: [] }
}



const YearlyReports: React.FC<{ year: number }> = ({ year }) => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [financialCategoryData, setFinancialCategoryData] = useState<FinancialCategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const stats = calculateStats(financialData)
    const { months, series, savingsPercentageSeries } = formatChartData(financialData)
    const [categoryChartData, setCategoryChartData] = useState<ChartData>({ months: [], series: [], savingsPercentageSeries: [] });


    const getFinancialData = async () => {
        setIsLoading(true)
        const financialData = await getFinancialOverviewByMonth(year)
        const expensesByCategoryParent = await getExpensesByParentCategory(year)
        setFinancialCategoryData(expensesByCategoryParent)
        setFinancialData(financialData)
        if (expensesByCategoryParent.length > 0) {
            setSelectedCategory(expensesByCategoryParent[0].categoryParent)
        }
        setIsLoading(false)
    }

    const handleCategoryChange = (selection: SharedSelection) => {
        const key = selection.currentKey as string
        setSelectedCategory(key)
    }

    const renderSkeletonGraphCard = () => {
        const totalSkeletons = 3;
        return Array.from({ length: totalSkeletons }).map((_, index) => (
            <GraphEskeleton key={index} />
        ))
    }

    useEffect(() => {
        getFinancialData()
    }, [year]);

    useEffect(() => {
        setCategoryChartData(formatChatCategoryData(financialCategoryData, selectedCategory))
    }, [selectedCategory, financialCategoryData]);

    return (
        <>
            {isLoading ?
                <div className="w-full mx-auto space-y-6">
                    {renderSkeletonGraphCard()}
                </div> :
                <div className="w-full mx-auto space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="shadow-sm border border-gray-100 rounded-2xl bg-white">
                            <CardHeader className="pb-0 pt-4 px-6 flex-col items-start border-b border-gray-50/80">
                                <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Vista de mes a mes</h4>
                                <small className="text-gray-500 font-medium pb-4">Ingresos, gastos y ahorros de los últimos 12 meses</small>
                            </CardHeader>
                            <CardBody className="overflow-hidden">
                                <div className="w-full h-[300px]">
                                    {typeof window !== "undefined" && (
                                        <Chart options={getAreaChartOptionsMonthly(months)} series={series} type="bar" height={300} />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-sm border border-gray-100 rounded-2xl bg-white">
                                <CardHeader className="pb-0 pt-4 px-6 flex-row justify-between items-start border-b border-gray-50/80">
                                    <div className="pb-4">
                                        <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Gastos por Categoría</h4>
                                        <small className="text-gray-500 font-medium">Gastos por categoría de los últimos 12 meses</small>
                                    </div>
                                    <div className="flex max-w-s">
                                        <Select
                                            size="md"
                                            label="Categoría"
                                            className="w-36"
                                            placeholder="Seleccione una categoria"
                                            selectedKeys={[selectedCategory]}
                                            onSelectionChange={handleCategoryChange}
                                        >
                                            {financialCategoryData.map((category: FinancialCategoryData) => (
                                                <SelectItem key={category.categoryParent}>{category.categoryParent}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardBody className="overflow-hidden">
                                    <div className="w-full h-[300px]">
                                        {typeof window !== "undefined" && (
                                            <Chart options={getAreaChartOptionsMonthlyCategory(categoryChartData.months)} series={categoryChartData.series} type="line" height={300} />
                                        )}
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="shadow-sm border border-gray-100 rounded-2xl bg-white">
                                <CardHeader className="pb-0 pt-4 px-6 flex-col items-start border-b border-gray-50/80">
                                    <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Porcentaje ahorrado</h4>
                                    <small className="text-gray-500 font-medium pb-4">Porcentaje de los ingresos no gastados</small>
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
                    </div>

                    <Card className="shadow-sm border border-gray-100 rounded-2xl bg-white mt-6">
                        <CardHeader className="pb-0 pt-4 px-6 border-b border-gray-50/80">
                            <h4 className="text-lg font-semibold text-gray-900 tracking-tight pb-4">Breakdown mensual</h4>
                        </CardHeader>
                        <CardBody>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Mes</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Ingresos</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Gastos</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">Ahorros</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-500">% Ahorrado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.dataWithPercentage.map((month, index) => (
                                            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                <td className="py-3 px-4 font-medium text-gray-700">{month.month}</td>
                                                <td className="text-right py-3 px-4 font-medium text-green-600">{formatCurrency(month.income)}</td>
                                                <td className="text-right py-3 px-4 font-medium text-rose-600">{formatCurrency(month.expenses)}</td>
                                                <td className="text-right py-3 px-4 font-medium text-blue-600">{formatCurrency(month.savings)}</td>
                                                <td className="text-right py-3 px-4 font-medium text-purple-600">{month.savingsPercentage}%</td>
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

export default YearlyReports

