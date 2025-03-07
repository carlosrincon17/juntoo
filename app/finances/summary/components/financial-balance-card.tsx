"use client"

import type React from "react"
import { Card, CardBody } from "@nextui-org/react"
import { FaCreditCard, FaDollarSign, FaMoneyBill, FaPiggyBank } from "react-icons/fa"
import { formatCurrency } from "@/app/lib/currency"

interface FinancialBalanceProps {
  patrimony: number
  savings: number
  debt: number
}

const FinancialBalanceCard: React.FC<FinancialBalanceProps> = ({
    patrimony = 120000,
    savings = 35000,
    debt = 45000,
}) => {
    // Calculate balance
    const balance = patrimony + savings - debt

    // Determine if balance is positive or negative
    const isPositiveBalance = balance >= 0

    return (
        <Card className="max-w-md shadow-md">
            <CardBody>

                {/* Financial items styled as a mathematical operation */}
                <div className="space-y-1 font-mono">
                    {/* Patrimony */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-emerald-500 font-bold">+</span>
                            <FaMoneyBill size={18} className="text-purple-500" />
                            <span className="text-default-600">Patrimonio</span>
                        </div>
                        <span className="text-purple-500 font-semibold">{formatCurrency(patrimony)}</span>
                    </div>

                    {/* Savings */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-emerald-500 font-bold">+</span>
                            <div className="flex items-center gap-2">
                                <FaPiggyBank size={18} className="text-emerald-500" />
                                <span className="text-default-600">Ahorros</span>
                            </div>
                        </div>
                        <span className="text-emerald-500 font-semibold">{formatCurrency(savings)}</span>
                    </div>

                    {/* Debt */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-red-500 font-bold">−</span>
                            <div className="flex items-center gap-2">
                                <FaCreditCard size={18} className="text-red-500" />
                                <span className="text-default-600">Deuda</span>
                            </div>
                        </div>
                        <span className="text-red-500 font-semibold">{formatCurrency(debt)}</span>
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
                            {formatCurrency(balance)}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default FinancialBalanceCard

