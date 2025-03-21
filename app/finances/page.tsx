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
import { User } from "../types/user";
import { getUser } from "../actions/auth";
import { getFinancialMetrics } from "./actions/financial-metrics";
import { FinancialMetrics } from "../types/financial";
import FinancialSummary from "./components/financial-summary";
import FinancialTransactionsList from "./monthly-report/components/expenses-table";

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
            {
                loading ?
                    <div className="flex justify-center items-center">
                        <CustomLoading className="mt-24" />
                    </div> :
                    expensesFilter?.endDate && totalExpenses.totalExpenses ?
                        <>
                            <div className="w-full max-w-7xl mx-auto space-y-6">
                                <div className="flex items-start justify-start max-h-full flex-wrap space-y-6 md:space-y-0">
                                    <div className="w-full md:w-1/3">
                                        {
                                            user && financialMetrics ?
                                                <FinancialSummary financialMetrics={financialMetrics} user={user} />
                                                :
                                                <CustomLoading className="mt-24" />
                                        }
                                    </div>
                                    <div className="w-full md:w-2/3 sm:pl-4 gap-4 grid grid-cols-1 md:grid-cols-3">
                                        <BudgetSimple totalBudget={19000000} spent={totalExpenses.totalExpenses} key="budget-chart"/>
                                        <div>

                                        </div>
                                        <div>

                                        </div>
                                        <div className="sm:col-span-3">
                                            <FinancialTransactionsList title="Ultimas Transacciones" />
                                        </div>
                                    </div>
                                    <NewExpensePanel isOpen={isOpen} onOpenChange={onOpenChange} transactionType={selectedTransactionType} />    
                                    <FloatingManageButton onNewIncomeClick={() => onCreateExpenseClick(TransactionType.Income)} onNewOutcomeClick={() => onCreateExpenseClick(TransactionType.Outcome)} />
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