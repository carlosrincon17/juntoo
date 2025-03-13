'use client'

import { useState } from "react";
import { getTotalsExpenses } from "../actions/expenses";
import { ExpensesFilters } from "../types/filters";
import { TotalExpenses } from "../types/expense";
import { Card, CardBody, useDisclosure } from "@nextui-org/react";
import { CustomLoading } from "../components/customLoading";
import BudgetSimple from "./components/budget-usage";
import ExpenseFilter from "./components/filter";
import NewExpensePanel from "./categories/components/new-expense-modal";
import { TransactionType } from "@/utils/enums/transaction-type";
import FloatingManageButton from "./components/floating-manage-buttons";

export default function Page() {

    const [totalExpenses, setTotalExpenses] = useState<TotalExpenses>({
        totalExpenses: 0,
        totalIncomes: 0,
    });
    const [expensesFilter, setExpensesFilter] = useState<ExpensesFilters | null>(null);
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType>(TransactionType.Outcome);

    const getTotalExpensesData = async (filters: ExpensesFilters) => {
        setLoading(true);
        const totalExpensesData = await getTotalsExpenses(filters);
        setLoading(false);
        setTotalExpenses(totalExpensesData);
    }

    const onCreateExpenseClick = (transactionType: TransactionType) => {
        setSelectedTransactionType(transactionType);
        onOpen();
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
                            <div className="w-full max-w-7xl mx-auto">
                                <FloatingManageButton onNewIncomeClick={() => onCreateExpenseClick(TransactionType.Income)} onNewOutcomeClick={() => onCreateExpenseClick(TransactionType.Outcome)} />
                               
                                <BudgetSimple totalBudget={19000000} spent={totalExpenses.totalExpenses} key="budget-chart"/>

                                <NewExpensePanel isOpen={isOpen} onOpenChange={onOpenChange} transactionType={selectedTransactionType} />
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