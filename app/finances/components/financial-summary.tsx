import { Card } from "@heroui/react";
import { formatCurrency } from "@/app/lib/currency";
import { FinancialMetrics } from "@/app/types/financial";
import { FaChevronUp, FaDollarSign } from "react-icons/fa";
import { ExpensesBreakdown } from "./expenses-breackdown";
import { TransactionType } from "@/utils/enums/transaction-type";
import { ExpensesFilters } from "@/app/types/filters";

export default function FinancialSummary({ financialMetrics, expensesFilter }: { financialMetrics: FinancialMetrics, expensesFilter?: ExpensesFilters }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-[#8b5cf6] via-[#9333ea] to-[#a78bfa] rounded-3xl xl:col-span-1">
                <div className="p-7 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        
                    <div className="flex items-center justify-between mb-1 relative">
                        <div className="flex items-center gap-2">
                            <FaDollarSign className="h-5 w-5 text-white/80" />
                            <h3 className="font-light text-sm tracking-wide text-white/90 uppercase">Balance Global</h3>
                        </div>
                        <span className="text-xs font-extralight text-white/80 bg-white/10 px-3 py-1 rounded-full">03/31</span>
                    </div>
        
                    <div className="flex items-end gap-3 mb-4">
                        <p className="text-3xl font-thin text-white">{formatCurrency(financialMetrics.savings.total || 0)}</p>
                    </div>
        
                    <div className="flex items-center gap-3 relative">
                        <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                            <FaChevronUp className="h-3 w-3 text-white" />
                            <span className="text-xs font-light text-white">{Math.round(financialMetrics.savings.variationPercentage)}%</span>
                        </div>
                        <span className="text-xs font-extralight text-white/70">vs. mes anterior</span>
                    </div>
        
                    <div className="mt-8 pt-6 border-t border-white/10 block">
                        <div className="block md:flex justify-between items-center">
                            <div>
                                <p className="text-md font-light text-white/70">Gastos Totales</p>
                                <p className="text-2xl font-extralight text-white">{formatCurrency(financialMetrics.expenses.total || 0)}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <p className="text-md font-light text-white/70">Ingresos Totales</p>
                                <p className="text-2xl font-extralight text-white">{formatCurrency(financialMetrics.investmentIncome.total || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        
            <ExpensesBreakdown totalExpenses={financialMetrics.expenses.total || 0} expensesFilter={expensesFilter} transactionType={TransactionType.Outcome} />
            <ExpensesBreakdown totalExpenses={financialMetrics.investmentIncome.total || 0} expensesFilter={expensesFilter} transactionType={TransactionType.Income} />
        </div>
    )
}