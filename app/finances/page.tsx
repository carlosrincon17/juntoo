'use client'

import { useState } from "react";
import { getTotalsExpenses } from "../actions/expenses";
import { ExpensesFilters } from "../types/filters";
import { TotalExpenses } from "../types/expense";
import { Button, Card, CardBody } from "@nextui-org/react";
import { CustomLoading } from "../components/customLoading";
import BudgetSimple from "./components/budget-usage";
import ExpenseFilter from "./components/filter";

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
            <div className="hidden">
                <ExpenseFilter onChange={onChangeFilters}/>
            </div>
            {
                loading ?
                    <div className="flex justify-center items-center">
                        <CustomLoading className="mt-24" />
                    </div> :
                    expensesFilter?.endDate && totalExpenses.totalExpenses ?
                        <>
                            <div className="w-full max-w-7xl mx-auto space-y-6">
                                <Card className="shadow-md">
                                    <div className="w-full p-5">
                                        <h2 className="text-xl font-semibold">Administra tus gastos</h2>
                                        <h5 className="text-default-500 text-sm">Agrega tus gastos para que siempre tengas un buen control de ellos</h5>
                                    </div>
                                    <div className="flex justify-center gap-4 mb-6">    
                                        <Button
                                            className="rounded-full w-24 h-24 bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center p-0"
                                        >
                                            <span className="text-white font-semibold">Ingreso</span>
                                        </Button>
                                        <Button
                                            className="rounded-full w-24 h-24 bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center p-0"
                                        >
                                            <span className="text-white font-semibold">Gasto</span>
                                        </Button>
                                    </div>
                                </Card>
                               
                                <BudgetSimple totalBudget={19000000} spent={totalExpenses.totalExpenses} />
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