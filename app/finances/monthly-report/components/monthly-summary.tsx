"use client"

import type React from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { FaChartLine, FaDollarSign, FaMoneyBill, FaPiggyBank } from "react-icons/fa"
import { formatCurrency } from "@/app/lib/currency"

interface TransactionsSummaryProps {
  income: number
  outcome: number
}

const MonthlySummaryCard: React.FC<TransactionsSummaryProps> = ({
    income = 0,
    outcome = 0
}) => {
    const savings = income - outcome;
    const isPositiveBalance = savings >= 0;
    const savingsPercentage = Math.round((savings / income) * 100);

    return (
        <Card className="max-w-md shadow-md">
            <CardHeader className="flex flex-col">
                <div className="flex w-full">
                    <h3 className="text-xl font-light">Transacciones del mes</h3>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-1 font-mono">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-emerald-500 font-bold">+</span>
                            <FaMoneyBill size={18} className="text-emerald-500" />
                            <span className="text-default-600">Ingresos</span>
                        </div>
                        <span className="text-emerald-500 font-semibold">{formatCurrency(income)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-red-500 font-bold">-</span>
                            <div className="flex items-center gap-2">
                                <FaDollarSign size={18} className="text-red-500" />
                                <span className="text-default-600">Gastos</span>
                            </div>
                        </div>
                        <span className="text-red-500 font-semibold">{formatCurrency(outcome)}</span>
                    </div>

                    <div className="border-t border-default-200 pt-2"></div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center">=</span>
                            <div className="flex items-center gap-2">
                                <FaPiggyBank size={18} className={isPositiveBalance ? "text-primary" : "text-red-500"} />
                                <span className="font-semibold">Ahorro</span>
                            </div>
                        </div>
                        <span className={`text-lg font-bold ${isPositiveBalance ? "text-primary" : "text-red-500"}`}>
                            {formatCurrency(savings)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-primary font-bold">%</span>
                            <div className="flex items-center gap-2">
                                <FaChartLine size={18} className={isPositiveBalance ? "text-primary" : "text-red-500"} />
                                <span className="font-semibold">Ahorrado</span>
                            </div>
                        </div>
                        <span className={`text-lg font-bold ${isPositiveBalance ? "text-primary" : "text-red-500"}`}>
                            {savingsPercentage}%
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default MonthlySummaryCard

