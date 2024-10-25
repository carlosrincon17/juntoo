'use client'

import { useEffect, useState } from "react";
import ExpensesBreackdown from "./components/expenses-breackdown"
import Kpi from "./components/kpi"
import { getTotalsExpenses } from "../actions/expenses";
import ExpenseFilter from "./components/filter";

export default function Page() {
    const [totalExpenses, setTotalExpenses] = useState(0);

    const getTotalExpensesData = async () => {
        const totalExpensesData = await getTotalsExpenses();
        setTotalExpenses(totalExpensesData);
    }

    useEffect(() => {
        getTotalExpensesData();
    }, []);

    return (
        <div>
            <ExpenseFilter />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4">
                    <Kpi title="Gastos" value={totalExpenses} customClasses={["from-red-400", "to-pink-500"]}/>
                    <Kpi title="Ingresos" value={10000000} customClasses={["from-green-400", "to-blue-500"]}/>
                </div>
                <div className="col-span-2 gap-4">
                    <ExpensesBreackdown totalExpenses={totalExpenses}/>
                </div>
            </div>
        </div>
    )
}