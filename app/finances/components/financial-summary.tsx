'use client';

import { Card } from "@heroui/react";
import { formatCurrency } from "@/app/lib/currency";
import { FinancialMetrics } from "@/app/types/financial";
import FinancialGoals from "./financial-goals";
import { useEffect, useState, useTransition } from "react";
import { getFinancialMetrics } from "../actions/financial-metrics";
import FinancialVariation from "./financial-variaton";
import { CustomLoading } from "@/app/components/customLoading";
import TransactionsList from "./transactions-list";
import { getExpensesFilterByDate } from "@/app/lib/dates";
import AiFinancialAssistant from "./ai-financial-assistant";

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
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const data = await getFinancialMetrics(date);
            setFinancialMetrics(data);
        });
    }, [date]);

    return (
        isPending ? (
            <CustomLoading />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 gap-6 grid grid-cols-1">
                    <Card className="shadow-lg border-none bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#7c3aed] group overflow-hidden relative">
                        <div className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
                            {/* Premium decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-white/10 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9333ea]/20 rounded-full blur-2xl translate-y-16 -translate-x-12"></div>

                            <div>
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-medium tracking-wide text-white/70 uppercase">Ahorro</p>
                                    </div>
                                </div>

                                <div className="flex items-end mb-2 relative z-10">
                                    <p className="text-4xl font-semibold text-white tracking-tight">{formatCurrency(financialMetrics.savings.total || 0)}</p>
                                </div>

                                <div className="flex items-center gap-1 relative z-10">
                                    <FinancialVariation
                                        variationPercentage={financialMetrics.savings.variationPercentage}
                                        amount={financialMetrics.savings.variationTotal}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10 block">
                                <div className="grid gap-6 md:flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-white/60 mb-1">Gastos</p>
                                        <p className="text-xl font-medium text-white tracking-tight mb-1">{formatCurrency(financialMetrics.expenses.total || 0)}</p>
                                        <FinancialVariation
                                            variationPercentage={financialMetrics.expenses.variationPercentage}
                                            amount={financialMetrics.expenses.variationTotal}
                                        />
                                    </div>
                                    <div className="text-right mt-4 md:mt-0">
                                        <p className="text-sm font-medium text-white/60 mb-1">Ingresos</p>
                                        <p className="text-xl font-medium text-white tracking-tight mb-1">{formatCurrency(financialMetrics.investmentIncome.total || 0)}</p>
                                        <FinancialVariation
                                            variationPercentage={financialMetrics.investmentIncome.variationPercentage}
                                            amount={financialMetrics.investmentIncome.variationTotal}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <AiFinancialAssistant metrics={financialMetrics} date={date} />
                    <FinancialGoals date={date} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <TransactionsList filter={getExpensesFilterByDate(date)} />
                </div>
            </div>
        )
    )
}