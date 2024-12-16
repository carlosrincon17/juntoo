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
import BalanceChart from "./components/balance-chart";
import ExpenseByUserChart from "./components/expenses-by-user";
import { Card, CardBody } from "@nextui-org/react";
import IncomeBreakdown from "./components/Incomes-brackdown";
import { CustomLoading } from "../components/customLoading";
import ExpensesByDate from "./components/expenses-by-date";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaBalanceScale} from "react-icons/fa";
import { MonthlyBudget } from "./components/monthly-budget";

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Kpi 
                                    title="Gastos" 
                                    value={totalExpenses.totalExpenses} 
                                    customClasses={["from-red-400", "to-pink-500"]} 
                                    isPressable={true} 
                                    onPress={() => router.push(FINANCE_ROUTES.EXPENSES.path)}
                                    icon={(<FaAngleDoubleDown className="text-red-500 opacity-90" />)}
                                />
                                <Kpi 
                                    title="Ingresos" 
                                    value={totalExpenses.totalIncomes} 
                                    customClasses={["from-green-400", "to-blue-500"]}
                                    isPressable={true} 
                                    onPress={() => router.push(FINANCE_ROUTES.EXPENSES.path)}
                                    icon={(<FaAngleDoubleUp className="text-green-500 opacity-90" />)}
                                />
                                <Kpi 
                                    title="Balance" 
                                    value={totalExpenses.totalIncomes - totalExpenses.totalExpenses} 
                                    customClasses={["from-blue-400", "to-cyan-500"]}
                                    icon={(<FaBalanceScale  className="text-blue-500 opacity-90" />)}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-6">
                                <MonthlyBudget totalExpenses={totalExpenses.totalExpenses}/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 auto-rows-[1fr]">
                                <div className="md:col-span-2">
                                    <ExpensesByDate expensesFilter={expensesFilter}/>
                                </div>
                                <div className="grid gap-4">
                                    <Card>
                                        <CardBody>
                                            <h3 className="text-xl font-light mb-4">Gastos por categoría</h3>
                                            <ExpensesBreakdown totalExpenses={totalExpenses.totalExpenses} expensesFilter={expensesFilter} transactionType={TransactionType.Outcome}/>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <BalanceChart totalExpenses={totalExpenses.totalExpenses} totalIncomes={totalExpenses.totalIncomes}/>
                                <ExpenseByUserChart expensesFilter={expensesFilter}/>
                                <IncomeBreakdown expensesFilter={expensesFilter}/>
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