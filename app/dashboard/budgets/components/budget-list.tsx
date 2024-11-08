'use client'

import { BudgetWithExpenses } from "@/app/types/budget";
import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getBudgetsActiveWithExpenses } from "../actions/bugdets";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";

export default function BudgetList() {

    const [activeBudgets, setActiveBudgets] = useState<BudgetWithExpenses[]>([]);
    const [loading, setLoading] = useState(true);

    const getBudgetsData = async () => {
        const budgets = await getBudgetsActiveWithExpenses();
        setLoading(false);
        setActiveBudgets(budgets);
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

    const renderBudget = (budget: BudgetWithExpenses) => {
        const totalAvailable = budget.value - budget.totalExpenses;
        const percentageUsed = (budget.totalExpenses / budget.value) * 100;
        const percentageAvailable = (totalAvailable / budget.value) * 100;
        const colorName = getColorBudget(budget);
        return (
            <Card className="max-w-md w-full bg-white shadow-lg" key={budget.id}>
                <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
                    <h2 className="text-lg font-bold text-gray-800">{budget.name}</h2>
                </CardHeader>
                <CardBody className="px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(budget.value)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">Disponible</p>
                            <p className={"text-2xl font-bold " + colorName}>{formatCurrency(budget.value - budget.totalExpenses)}</p>
                        </div>
                    </div>
                    <Progress 
                        aria-label="Budget progress" 
                        value={percentageUsed} 
                        className="h-3"
                        classNames={{
                            base: "max-w-md",
                            track: "drop-shadow-md border border-default",
                            indicator: "bg-gradient-to-r from-sky-500 to-emerald-500",
                            label: "tracking-wider font-medium text-default-600",
                            value: "text-foreground/60",
                        }}
                    />
                    <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-500">{formatCurrency(budget.totalExpenses)} usado</p>
                        <p className="text-sm text-gray-500">{percentageAvailable.toFixed(1)}% disponible</p>
                    </div>
                </CardBody>
            </Card>
        )
    };

    useEffect(() => {
        getBudgetsData();
    }, []);

    return (
        <>
            { loading ?
                <CustomLoading /> :
                <div className="full-width">
                    <div className="flex flex-wrap gap-8 sm:columns-1 md:columns-2">
                        {activeBudgets.map((budget) => renderBudget(budget))}
                    </div>
                </div>
            }
        </>
    )
}