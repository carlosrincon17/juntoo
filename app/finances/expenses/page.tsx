'use client'

import { getCountExpenses, getExpenses, removeExpense } from "@/app/actions/expenses";
import { Expense } from "@/app/types/expense";
import { useEffect, useState } from "react";
import ExpensesTable from "./components/expenses-table";
import { CustomLoading } from "@/app/components/customLoading";
import toast from "react-hot-toast";
import ToastCustom from "@/app/components/toastCustom";

export default function Page() {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [countExpenses, setCountExpenses] = useState(1);
    const perPage = 10;

    const getExpensesData = async () => {
        setLoading(true);
        const expensesData = await getExpenses(page, perPage);
        const countExpensesData = await getCountExpenses();
        setLoading(false);
        setExpenses(expensesData);
        setCountExpenses((countExpensesData / perPage) + 1);
    }

    const onDeleteExpense = async (expense: Expense) => {
        setLoading(true);
        await removeExpense(expense);
        toast.custom((t) => <ToastCustom message="Tu gasto se ha eliminado correctamente" toast={t}/>);
        getExpensesData();
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
                    onDeleteExpense={onDeleteExpense}
                />
            }
        </div>
    )
}