'use client'

import { getBudgetsActiveWithExpenses } from "@/app/dashboard/budgets/actions/bugdets";
import { formatCurrency } from "@/app/lib/currency";
import { BudgetWithExpenses } from "@/app/types/budget";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function BudgetsSummary() {

    const [budgets, setBudgets] = useState<BudgetWithExpenses[]>([]);

    const getBudgetsData = async () => {
        const budgetsData = await getBudgetsActiveWithExpenses();
        setBudgets(budgetsData);
    }

    const getColorBudget = (budget: BudgetWithExpenses) => {
        const totalAvailable = budget.value - budget.totalExpenses;
        const limitOrange = budget.value * 0.5;
        const limitRed = budget.value * 0.2;
        if (totalAvailable < limitRed)
            return "text-red-700";
        if (totalAvailable < limitOrange)
            return "text-orange-700";
        return "text-green-700";
    }

    useEffect(() => {
        getBudgetsData();
    }, []);

    return (
        <div>
            <Card className="p-6">
                <CardHeader className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
                    <h3 className="text-2xl font-semibold">Presupuestos</h3>
                    <span className="text-default-400">
                        {budgets.length} presupuestos
                    </span>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {budgets.map((budget) => (
                            <div key={budget.id} className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
                                <span>{budget.name} <span className="text-small font-light">({formatCurrency(budget.value)})</span></span>
                                <span className={`font-semibold ${getColorBudget(budget)}`}>{formatCurrency(budget.value - budget.totalExpenses)}</span>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}