'use client'

import { useState } from "react";
import { getTotalsExpenses } from "../actions/expenses";
import { ExpensesFilters } from "../types/filters";
import { TotalExpenses } from "../types/expense";
import { Card, CardBody, useDisclosure } from "@heroui/react";
import { CustomLoading } from "../components/customLoading";
import ExpenseFilter from "./components/filter";
import NewExpensePanel from "./categories/components/new-expense-modal";
import { TransactionType } from "@/utils/enums/transaction-type";
import FloatingManageButton from "./components/floating-manage-buttons";
import { User } from "../types/user";
import { getUser } from "../actions/auth";
import { getFinancialMetrics } from "./actions/financial-metrics";
import { FinancialMetrics } from "../types/financial";
import FinancialSummary from "./components/financial-summary";
import ExpensesByDate from "./components/expenses-by-date";

export default function Page() {

    const [totalExpenses, setTotalExpenses] = useState<TotalExpenses>({
        totalExpenses: 0,
        totalIncomes: 0,
    });
    const [expensesFilter, setExpensesFilter] = useState<ExpensesFilters | null>(null);
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType>(TransactionType.Outcome);
    const [user, setUser] = useState<User | null>(null);
    const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics>();

    const getTotalExpensesData = async (filters: ExpensesFilters) => {
        setLoading(true);
        setUser(await getUser());
        const totalExpensesData = await getTotalsExpenses(filters);
        const financialMetricsData = await getFinancialMetrics();
        console.log("financialMetricsData", financialMetricsData);
        setFinancialMetrics(financialMetricsData);
        setTotalExpenses(totalExpensesData);
        setLoading(false);
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

            <NewExpensePanel isOpen={isOpen} onOpenChange={onOpenChange} transactionType={selectedTransactionType} />
            <FloatingManageButton onNewIncomeClick={() => onCreateExpenseClick(TransactionType.Income)} onNewOutcomeClick={() => onCreateExpenseClick(TransactionType.Outcome)} />
            {
                loading || !(user && financialMetrics )?
                    <div className="flex justify-center items-center">
                        <CustomLoading className="mt-24" />
                    </div> :
                    expensesFilter?.endDate && totalExpenses.totalExpenses ?
                        <>
                            <div className="w-full max-w-8xl mx-auto space-y-6">
                                <FinancialSummary financialMetrics={financialMetrics} expensesFilter={expensesFilter} />
                                <ExpensesByDate expensesFilter={expensesFilter} />
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