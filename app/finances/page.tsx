'use client'

import { useState } from "react";
import { getTotalsExpenses } from "../actions/expenses";
import { ExpensesFilters } from "../types/filters";
import { TotalExpenses } from "../types/expense";
import { Card, CardBody, CardFooter, CardHeader, Divider, useDisclosure } from "@nextui-org/react";
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
import { formatCurrency } from "../lib/currency";
import { VariationIndicator } from "./components/variation-indicator";

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
                                        <Card className="p-4 w-full shadow-md">
                                            <CardHeader className="space-y-2 block">
                                                <h1 className="text-2xl font-extralight">Hola {user?.name}</h1> 
                                                <div className="flex flex-col">
                                                    <p className="text-sm text-default-500">Este es tu resumen financiero de tu familia 
                                                        comparado con los datos promedio de los meses anteriores
                                                    </p>
                                                </div>
                                            </CardHeader>
                                            <CardBody className="py-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-default-600">Gastos</span>
                                                        <span className="text-xl font-bold text-danger">{formatCurrency(financialMetrics?.expenses.total || 0)}</span>
                                                        <div className="flex items-center">
                                                            <VariationIndicator value={financialMetrics?.expenses.variationPercentage || 0}  />
                                                            <span className="text-xs ml-1 text-default-500">vs. meses anteriores</span>
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-default-600">Ingresos</span>
                                                        <span className="text-xl font-bold text-success">{formatCurrency(financialMetrics?.investmentIncome.total || 0)}</span>
                                                        <div className="flex items-center">
                                                            <VariationIndicator value={financialMetrics?.investmentIncome.variationPercentage || 0} />
                                                            <span className="text-xs ml-1 text-default-500">vs. meses anteriores</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                            <CardFooter className="pt-0">
                                                <div className="w-full flex justify-between items-center">
                                                    <span className="text-sm font-medium">Balance</span>
                                                    <span className="text-lg font-bold">{formatCurrency((financialMetrics?.investmentIncome.total || 0) - (financialMetrics?.expenses.total || 0))}</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                    <div className="w-full md:w-2/3 sm:pl-6">
                                        <FloatingManageButton onNewIncomeClick={() => onCreateExpenseClick(TransactionType.Income)} onNewOutcomeClick={() => onCreateExpenseClick(TransactionType.Outcome)} />
                                        <BudgetSimple totalBudget={19000000} spent={totalExpenses.totalExpenses} key="budget-chart"/>
                                        <NewExpensePanel isOpen={isOpen} onOpenChange={onOpenChange} transactionType={selectedTransactionType} />
                                    </div>
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