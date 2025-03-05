'use client'

import { useState } from "react";
import {ExpensesBreakdown} from "./components/expenses-breackdown"
import Kpi from "./components/kpi"
import { getTotalsExpenses } from "../actions/expenses";
import ExpenseFilter from "./components/filter";
import { ExpensesFilters } from "../types/filters";
import { useRouter } from "next/navigation";
import { FINANCE_ROUTES } from "@/utils/navigation/routes-constants";
import { TotalExpenses } from "../types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Card, CardBody } from "@nextui-org/react";
import { CustomLoading } from "../components/customLoading";
import ExpensesByDate from "./components/expenses-by-date";
import FinancialTransactionsList from "./components/expenses-table";
import BudgetSimple from "./components/budget-usage";

export default function Page() {

    const [totalExpenses, setTotalExpenses] = useState<TotalExpenses>({
        totalExpenses: 0,
        totalIncomes: 0,
    });
    const [expensesFilter, setExpensesFilter] = useState<ExpensesFilters | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-1">
                                    <Kpi 
                                        title="Ingresos" 
                                        value={totalExpenses.totalIncomes} 
                                        isPressable={true} 
                                        onPress={() => router.push(FINANCE_ROUTES.EXPENSES.path)}
                                        color="text-green-500"
                                    />
                                    <Kpi 
                                        title="Gastos" 
                                        value={totalExpenses.totalExpenses} 
                                        isPressable={true} 
                                        onPress={() => router.push(FINANCE_ROUTES.EXPENSES.path)}
                                        color="text-red-500"
                                    />
                                    <Kpi 
                                        title="Disponible" 
                                        value={totalExpenses.totalIncomes - totalExpenses.totalExpenses} 
                                        color="text-blue-500"
                                    />
                                    <Kpi
                                        title="Porcentaje de ahorro"
                                        value={totalExpenses.totalExpenses ? (totalExpenses.totalIncomes - totalExpenses.totalExpenses) / totalExpenses.totalIncomes * 100 : 0}
                                        color="text-purple-500"
                                        type="percentage"
                                    />
                                </div>
                            </div>
                            <div>
                                <BudgetSimple totalBudget={19000000} spent={totalExpenses.totalExpenses} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-6">
                                <ExpensesByDate expensesFilter={expensesFilter} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                <div className="col-span-1 md:col-span-2">
                                    <Card>
                                        <CardBody>
                                            <h3 className="text-xl font-light mb-4">Gastos por categoría</h3>
                                            <ExpensesBreakdown totalExpenses={totalExpenses.totalExpenses} expensesFilter={expensesFilter} transactionType={TransactionType.Outcome}/>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <FinancialTransactionsList  expensesFilter={expensesFilter} />
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