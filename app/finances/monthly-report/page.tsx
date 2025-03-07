'use client'

import { useState } from "react";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Card, CardBody } from "@nextui-org/react";
import { TotalExpenses } from "@/app/types/expense";
import { ExpensesFilters } from "@/app/types/filters";
import { getTotalsExpenses } from "@/app/actions/expenses";
import ExpenseFilter from "./components/filter";
import { CustomLoading } from "@/app/components/customLoading";
import MonthlySummaryCard from "./components/monthly-summary";
import FinancialTransactionsList from "./components/expenses-table";
import { ExpensesBreakdown } from "./components/expenses-breackdown";
import ExpensesByDate from "./components/expenses-by-date";

export default function Page() {

    const [totalExpenses, setTotalExpenses] = useState<TotalExpenses>({
        totalExpenses: 0,
        totalIncomes: 0,
    });
    const [expensesFilter, setExpensesFilter] = useState<ExpensesFilters | null>(null);
    const [loading, setLoading] = useState(true);

    const getTotalExpensesData = async (filters: ExpensesFilters) => {
        setLoading(true);
        const totalExpensesData = await getTotalsExpenses(filters);
        setLoading(false);
        setTotalExpenses(totalExpensesData);
    }

    const onChangeFilters = (year: number, month: number) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        getTotalExpensesData({
            startDate,
            endDate
        });
        setExpensesFilter({
            startDate,
            endDate
        });
    }

    return (
        <div>
            <ExpenseFilter onChange={onChangeFilters}/>
            {
                loading ?
                    <div className="flex justify-center items-center">
                        <CustomLoading className="mt-24" />
                    </div> :
                    expensesFilter?.endDate && totalExpenses.totalExpenses ?
                        <>
                            <div className="w-full max-w-7xl mx-auto space-y-6">
                                <div className="flex items-start justify-start max-h-full flex-wrap">
                                    <div className="grid grid-cols-1 gap-4 w-full md:w-1/3">
                                        <MonthlySummaryCard income={totalExpenses.totalIncomes} outcome={totalExpenses.totalExpenses} />
                                        <Card className="shadow-md">
                                            <CardBody>
                                                <h3 className="text-xl font-light mb-4">Gastos por categoría</h3>
                                                <ExpensesBreakdown totalExpenses={totalExpenses.totalExpenses} expensesFilter={expensesFilter} transactionType={TransactionType.Outcome}/>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className="grid grid-cols-1 sm:pl-6 sm:px-4 w-full md:w-2/3 mt-6 sm:mt-0">
                                        <FinancialTransactionsList  expensesFilter={expensesFilter} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 w-full">
                                    <ExpensesByDate  expensesFilter={expensesFilter} />
                                </div>
                            </div>
                        </>
                        : 
                        <div>
                            <Card>
                                <CardBody className="p-4">
                                    <div className="flex mb-2 p-12 justify-center items-center">
                                        <h3 className="text-2xl font-extralight text-gray-900">Upps... no encontramos ningún gasto</h3>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
            }
        </div>
    )
}