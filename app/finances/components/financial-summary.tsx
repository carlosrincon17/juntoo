'use client';

import { Card } from "@heroui/react";
import { formatCurrency } from "@/app/lib/currency";
import { FinancialMetrics } from "@/app/types/financial";
import FinancialGoals from "./financial-goals";
import { useEffect, useState } from "react";
import { getFinancialMetrics } from "../actions/financial-metrics";
import FinancialVariation from "./financial-variaton";
import { CustomLoading } from "@/app/components/customLoading";
import TransactionsList from "./transactions-list";
import { getExpensesFilterByDate } from "@/app/lib/dates";

const emptyFinancialMetrics: FinancialMetrics = {
    expenses: {
        total: 0,
        last: 0,
        variationPercentage: 0,
        variationTotal: 0,
    },
    investmentIncome: {
        total: 0,
        last: 0,
        variationPercentage: 0,
        variationTotal: 0,
    },
    savings: {
        total: 0,
        last: 0,
        variationPercentage: 0,
        variationTotal: 0,
    }
}

export default function FinancialSummary({ date }: { date: Date }) {

    const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics>(emptyFinancialMetrics);
    const [isLoading, setIsLoading] = useState(true);

    const loadFinancialMetrics = async () => {
        setIsLoading(true);
        const financialMetricsData = await getFinancialMetrics(date);
        setFinancialMetrics(financialMetricsData);
        setIsLoading(false);
    }

    useEffect(() => {
        loadFinancialMetrics();
    }, [date]);

    return (
        isLoading ? (
            <CustomLoading />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 gap-6 grid grid-cols-1">
                    <Card className="shadow-md bg-gradient-to-r from-[#8b5cf6] via-[#9333ea] to-[#a78bfa]">
                        <div className="p-4 relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

                            <div className="flex items-center justify-between mb-1 relative">
                                <div className="flex items-center gap-1">
                                    <p className="text-md font-light text-white/70">Ahorro</p>
                                </div>
                            </div>

                            <div className="flex items-end">
                                <p className="text-3xl font-extralight text-white">{formatCurrency(financialMetrics.savings.total || 0)}</p>
                            </div>

                            <div className="flex items-center gap-1 relative">
                                <FinancialVariation
                                    variationPercentage={financialMetrics.savings.variationPercentage}
                                    amount={financialMetrics.savings.variationTotal}
                                />
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 block">
                                <div className="grid gap-4 md:flex justify-between items-center">
                                    <div>
                                        <p className="text-md font-light text-white/70">Gastos</p>
                                        <p className="text-2xl font-extralight text-white">{formatCurrency(financialMetrics.expenses.total || 0)}</p>
                                        <FinancialVariation
                                            variationPercentage={financialMetrics.expenses.variationPercentage}
                                            amount={financialMetrics.expenses.variationTotal}
                                        />
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <p className="text-md font-light text-white/70">Ingresos</p>
                                        <p className="text-2xl font-extralight text-white">{formatCurrency(financialMetrics.investmentIncome.total || 0)}</p>
                                        <FinancialVariation
                                            variationPercentage={financialMetrics.investmentIncome.variationPercentage}
                                            amount={financialMetrics.investmentIncome.variationTotal}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <FinancialGoals date={date} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <TransactionsList filter={getExpensesFilterByDate(date)} />
                </div>
            </div>
        )
    )
}