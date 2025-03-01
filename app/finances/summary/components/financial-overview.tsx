"use client"

import type React from "react"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"
import type {
    FinancialData,
    FinancialStats,
    StatCardProps,
    ChartData,
    FinancialDataWithPercentage,
} from "@/app/types/financial"

// Import ApexCharts dynamically to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

// Sample data - replace with your actual data
const financialData: FinancialData[] = [
    { month: "Jan", expenses: 2100, income: 3500, savings: 1400 },
    { month: "Feb", expenses: 2300, income: 3500, savings: 1200 },
    { month: "Mar", expenses: 2000, income: 3600, savings: 1600 },
    { month: "Apr", expenses: 2800, income: 3700, savings: 900 },
    { month: "May", expenses: 2400, income: 3800, savings: 1400 },
    { month: "Jun", expenses: 2200, income: 3800, savings: 1600 },
    { month: "Jul", expenses: 2500, income: 3900, savings: 1400 },
    { month: "Aug", expenses: 2700, income: 3900, savings: 1200 },
    { month: "Sep", expenses: 2300, income: 4000, savings: 1700 },
    { month: "Oct", expenses: 2100, income: 4000, savings: 1900 },
    { month: "Nov", expenses: 2400, income: 4100, savings: 1700 },
    { month: "Dec", expenses: 3000, income: 4200, savings: 1200 },
]

// Calculate averages and percentages
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

// Format data for ApexCharts
const formatChartData = (data: FinancialData[]): ChartData => {
    const months = data.map((item) => item.month)

    const series = [
        {
            name: "Income",
            data: data.map((item) => item.income),
        },
        {
            name: "Expenses",
            data: data.map((item) => item.expenses),
        },
        {
            name: "Savings",
            data: data.map((item) => item.savings),
        },
    ]

    const savingsPercentageSeries = [
        {
            name: "Savings %",
            data: data.map((item) => Math.round((item.savings / item.income) * 100)),
        },
    ]

    return { months, series, savingsPercentageSeries }
}

const FinancialOverview: React.FC = () => {
    const stats = calculateStats(financialData)
    const { months, series, savingsPercentageSeries } = formatChartData(financialData)

    // Area chart options
    const areaChartOptions: ApexOptions = {
        chart: {
            type: "area",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            categories: months,
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `$${value}`,
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${value}`,
            },
        },
        colors: ["#22c55e", "#ef4444", "#3b82f6"],
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.1,
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
        },
        theme: {
            mode: "light",
        },
    }

    // Bar chart options
    const barChartOptions: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "60%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: months,
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `${value}%`,
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `${value}%`,
            },
        },
        colors: ["#8b5cf6"],
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
        },
        theme: {
            mode: "light",
        },
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-semibold text-center mb-6">Family Financial Overview</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Avg. Monthly Income" value={`$${stats.avgIncome.toLocaleString()}`} color="text-green-500" />
                <StatCard title="Avg. Monthly Expenses" value={`$${stats.avgExpenses.toLocaleString()}`} color="text-red-500" />
                <StatCard title="Avg. Monthly Savings" value={`$${stats.avgSavings.toLocaleString()}`} color="text-blue-500" />
                <StatCard title="Avg. Savings Rate" value={`${stats.avgSavingsPercentage}%`} color="text-purple-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card className="shadow-sm">
                    <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                        <h4 className="text-lg font-medium">Monthly Overview</h4>
                        <small className="text-default-500">Income, expenses and savings for the last 12 months</small>
                    </CardHeader>
                    <CardBody className="overflow-hidden">
                        <div className="w-full h-[300px]">
                            {typeof window !== "undefined" && (
                                <Chart options={areaChartOptions} series={series} type="area" height={300} />
                            )}
                        </div>
                    </CardBody>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                        <h4 className="text-lg font-medium">Savings Percentage</h4>
                        <small className="text-default-500">Monthly savings as percentage of income</small>
                    </CardHeader>
                    <CardBody className="overflow-hidden">
                        <div className="w-full h-[300px]">
                            {typeof window !== "undefined" && (
                                <Chart options={barChartOptions} series={savingsPercentageSeries} type="bar" height={300} />
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Monthly Data Table */}
            <Card className="shadow-sm mt-6">
                <CardHeader className="pb-0 pt-4 px-4">
                    <h4 className="text-lg font-medium">Monthly Breakdown</h4>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Month</th>
                                    <th className="text-right py-3 px-4">Income</th>
                                    <th className="text-right py-3 px-4">Expenses</th>
                                    <th className="text-right py-3 px-4">Savings</th>
                                    <th className="text-right py-3 px-4">Savings %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.dataWithPercentage.map((month, index) => (
                                    <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="py-3 px-4">{month.month}</td>
                                        <td className="text-right py-3 px-4 text-green-600">${month.income.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-red-600">${month.expenses.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-blue-600">${month.savings.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-purple-600">{month.savingsPercentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
    return (
        <Card className="shadow-sm">
            <CardBody className="py-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-default-500">{title}</p>
                    <Divider className="my-2" />
                    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
                </div>
            </CardBody>
        </Card>
    )
}

export default FinancialOverview

