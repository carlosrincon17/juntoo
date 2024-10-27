'use client'

import { Budget } from "@/app/types/budget";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getBudgets } from "../actions/bugdets";
import { ItemCounter } from "./item-counter";
import { formatCurrency } from "@/app/lib/currency";
import { FaCircle } from "react-icons/fa";

export default function BudgetList() {

    const [activeBudgets, setActiveBudgets] = useState<Budget[]>([]);


    const getBudgetsData = async () => {
        const budgets = await getBudgets();
        setActiveBudgets(budgets);
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
                        startContent={<FaCircle className={budget.isActive ? "text-green-500": "text-gray-500"} />}
                        endContent={<ItemCounter value={formatCurrency(budget.value)} />}
                    >
                        {budget.name}
                    </ListboxItem>
                ))}
            </Listbox>
        </div>
    )
}