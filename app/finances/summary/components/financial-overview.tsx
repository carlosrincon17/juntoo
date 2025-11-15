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
import { CustomLoading } from "@/app/components/customLoading"
import { FaBuilding, FaChartPie, FaCreditCard, FaWallet } from "react-icons/fa"


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

const FinancialOverview: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const stats = calculateStats(financialData)


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
                <div className="grid grid-cols-1">
                    <Card className="shadow-md">
                        <CardHeader className="pb-0 pt-4 grid grid-cols-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg text-[#121432] tracking-tight">Resumen Financiero</h3>
                                <div className="p-2 rounded-full bg-gradient-to-r from-[#5a6bff]/10 to-[#a78bfa]/10">
                                    <FaChartPie className="h-4 w-4 text-[#5a6bff]" />
                                </div>
                            </div>
                            <p className="text-sm font-light text-[#121432]/60">Promedio anual de gastos, ingresos y ahorros</p>
                        </CardHeader>
    
                        <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
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
                        </CardBody>
                    </Card>
                </div>
            }
        </>
    )
}

export default FinancialOverview

