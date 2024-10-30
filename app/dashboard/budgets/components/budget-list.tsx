'use client'

import { BudgetWithExpenses } from "@/app/types/budget";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getBudgetsActiveWithExpenses } from "../actions/bugdets";
import { ItemCounter } from "./item-counter";
import { formatCurrency } from "@/app/lib/currency";
import { FaCircle } from "react-icons/fa";

export default function BudgetList() {

    const [activeBudgets, setActiveBudgets] = useState<BudgetWithExpenses[]>([]);


    const getBudgetsData = async () => {
        const budgets = await getBudgetsActiveWithExpenses();
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

    useEffect(() => {
        getBudgetsData();
    }, []);

    return (
        <div className="full-width">
            <Listbox
                className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium"
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                }}
            >
                {activeBudgets.map((budget) => (
                    <ListboxItem key={budget.id} value={budget.id}
                        startContent={<FaCircle className={getColorBudget(budget)} />}
                        endContent={
                            <div className={getColorBudget(budget)}>
                                <ItemCounter value={formatCurrency(budget.value - budget.totalExpenses)}/>
                            </div>
                        }
                        className="text-small"
                    >
                        <span className="text-medium"> {budget.name} </span> <span className="text-small font-light text-default-400">({formatCurrency(budget.value)})</span>
                    </ListboxItem>
                ))}
            </Listbox>
        </div>
    )
}