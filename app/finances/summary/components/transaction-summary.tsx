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
        <Card className="h-full shadow-md bg-gradient-to-r from-[#8b5cf6] via-[#9333ea] to-[#a78bfa] rounded-3xl xl:col-span-1">
            <div className="p-7 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

                <div className="flex items-center justify-between mb-1 relative">
                    <div className="flex items-center gap-2">
                        <h3 className="font-light text-lg tracking-wide text-white/90 uppercase">Balance Global</h3>
                    </div>
                </div>

                <div className="flex items-end gap-3 mb-2">
                    <p className="text-3xl font-thin text-white">{formatCurrency(yearExpenses.totalIncomes - yearExpenses.totalExpenses)}</p>
                </div>

                <div className="mt-2 pt-6 border-t border-white/10 block">
                    <div className="block md:flex justify-between items-center">
                        <div>
                            <p className="text-md font-light text-white/70">Gastos Totales</p>
                            <p className="text-2xl font-extralight text-white">{formatCurrency(yearExpenses.totalExpenses)}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="text-md font-light text-white/70">Ingresos Totales</p>
                            <p className="text-2xl font-extralight text-white">{formatCurrency(yearExpenses.totalIncomes)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}