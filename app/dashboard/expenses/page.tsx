'use client'

import { getExpenses } from "@/app/actions/expenses";
import { Expense } from "@/app/types/expense";
import { useEffect, useState } from "react";
import ExpensesTable from "./components/expenses-table";
import { CustomLoading } from "@/app/components/customLoading";

export default function Page() {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const page = 0;
    const perPage = 10;

    const getExpensesData = async () => {
        const expensesData = await getExpenses(page, perPage);
        setLoading(false);
        setExpenses(expensesData);
    }

    useEffect(() => {
        getExpensesData();
    }, [page, perPage]);

    return (
        <div>
            {loading ? <CustomLoading /> : <ExpensesTable expenses={expenses}/>}
        </div>
    )
}