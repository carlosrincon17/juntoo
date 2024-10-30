'use client'

import { getCountExpenses, getExpenses } from "@/app/actions/expenses";
import { Expense } from "@/app/types/expense";
import { useEffect, useState } from "react";
import ExpensesTable from "./components/expenses-table";
import { CustomLoading } from "@/app/components/customLoading";
import { TransactionType } from "@/utils/enums/transaction-type";

export default function Page() {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [countExpenses, setCountExpenses] = useState(1);
    const perPage = 10;

    const getExpensesData = async () => {
        const expensesData = await getExpenses(page, perPage);
        const countExpensesData = await getCountExpenses(TransactionType.Outcome);
        setLoading(false);
        setExpenses(expensesData);
        setCountExpenses((countExpensesData / perPage) + 1);
    }

    useEffect(() => {
        getExpensesData();
    }, [page, perPage]);

    return (
        <div>
            {loading ? 
                <CustomLoading /> : 
                <ExpensesTable 
                    expenses={expenses} 
                    onPageChange={(page) => setPage(page)} 
                    perPage={perPage} 
                    currentPage={page}
                    countExpenses={countExpenses}
                />
            }
        </div>
    )
}