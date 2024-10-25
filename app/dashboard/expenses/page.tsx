'use client'

import { getExpenses } from "@/app/actions/expenses";
import { Expense } from "@/app/types/expense";
import { useEffect, useState } from "react";

export default function Page() {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const page = 0;
    const perPage = 10;

    const getExpensesData = async () => {
        const expensesData = await getExpenses(page, perPage);
        console.log(expensesData)
        setExpenses(expensesData);
    }

    useEffect(() => {
        getExpensesData();
    }, [page, perPage]);

    return (
        <h1>Hello {expenses.length}, Expenses Page!</h1>
    )
}