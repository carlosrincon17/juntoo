"use client"

import type React from "react"
import { Card, CardBody } from "@heroui/react"
import { FaDollarSign, FaMoneyBill, FaPiggyBank } from "react-icons/fa"
import { formatCurrency } from "@/app/lib/currency"

interface TransactionsSummaryProps {
  income: number
  outcome: number
}

const TransactionsSummaryCard: React.FC<TransactionsSummaryProps> = ({
    income = 0,
    outcome = 0
}) => {
    // Calculate balance
    const savings = income - outcome

    // Determine if balance is positive or negative
    const isPositiveBalance = savings >= 0

    return (
        <Card className="max-w-md shadow-md">
            <CardBody>
                <h4 className="text-lg font-medium mt-4">Resumen de transacciones</h4>
                <small className="text-default-500">Consolidado de ingresos, transacciones y gastos de los ultimos 12 meses</small>
                {/* Financial items styled as a mathematical operation */}
                <div className="space-y-1 font-mono mt-4">
                    {/* Patrimony */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-emerald-500 font-bold">+</span>
                            <FaMoneyBill size={18} className="text-green-500" />
                            <span className="text-default-600">Ingresos</span>
                        </div>
                        <span className="text-purple-500 font-semibold">{formatCurrency(income)}</span>
                    </div>

                    {/* Savings */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-emerald-500 font-bold">+</span>
                            <div className="flex items-center gap-2">
                                <FaPiggyBank size={18} className="text-emerald-500" />
                                <span className="text-default-600">Gastos</span>
                            </div>
                        </div>
                        <span className="text-emerald-500 font-semibold">{formatCurrency(outcome)}</span>
                    </div>

                    {/* Divider line */}
                    <div className="border-t border-default-200 pt-2"></div>

                    {/* Balance */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center">=</span>
                            <div className="flex items-center gap-2">
                                <FaDollarSign size={18} className={isPositiveBalance ? "text-primary" : "text-red-500"} />
                                <span className="font-semibold">Balance</span>
                            </div>
                        </div>
                        <span className={`text-lg font-bold ${isPositiveBalance ? "text-primary" : "text-red-500"}`}>
                            {formatCurrency(savings)}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default TransactionsSummaryCard

