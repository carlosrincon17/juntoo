"use client"

import { getTotalsExpenses } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency"
import { TotalExpenses } from "@/app/types/expense";
import { ExpensesFilters } from "@/app/types/filters";
import { Card } from "@heroui/react"
import { useEffect, useState } from "react";

export default function TransactionsSummaryCard() {

    const [yearExpenses, setYearExpenses] = useState<TotalExpenses>({
        totalExpenses: 0,
        totalIncomes: 0
    })

    const getLastYearExpensesFilter = (): ExpensesFilters => {
        const today = new Date();
        const endDate = new Date(today);
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
    
        return {
            startDate,
            endDate
        };
    };

    const getYearExpensesData = async () => {
        const yearExpensesData = await getTotalsExpenses(getLastYearExpensesFilter());
        setYearExpenses(yearExpensesData);
    }

    useEffect(() => {
        getYearExpensesData();
    }, []);

    return (
        <Card className="h-full shadow-lg border-none bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] xl:col-span-1 group overflow-hidden relative">
            <div className="p-6 relative h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-white/10 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6366f1]/20 rounded-full blur-2xl translate-y-16 -translate-x-12"></div>

                <div>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <h3 className="font-medium text-sm tracking-wide text-white/70 uppercase">Balance Global</h3>
                    </div>

                    <div className="flex items-end gap-3 mb-6 relative z-10 mt-2">
                        <p className="text-4xl font-semibold text-white tracking-tight">{formatCurrency(yearExpenses.totalIncomes - yearExpenses.totalExpenses)}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 relative z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-white/60 mb-1">Gastos Totales</p>
                            <p className="text-xl font-medium text-white tracking-tight">{formatCurrency(yearExpenses.totalExpenses)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-white/60 mb-1">Ingresos Totales</p>
                            <p className="text-xl font-medium text-white tracking-tight">{formatCurrency(yearExpenses.totalIncomes)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}