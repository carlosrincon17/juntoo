import { Card, CardBody } from "@heroui/react";
import { Expense } from "@/app/types/expense";
import { formatCurrency } from "@/app/lib/currency";
import { FaMoneyBillWave } from "react-icons/fa";

interface TransactionsTimelineListProps {
    data: Expense[];
}

export default function TransactionsTimelineList({ data }: TransactionsTimelineListProps) {
    if (data.length === 0) {
        return (
            <Card className="shadow-md">
                <CardBody className="py-10 text-center text-gray-500">
                    No se encontraron transacciones.
                </CardBody>
            </Card>
        );
    }

    // Group expenses by date
    const groupedExpenses = data.reduce((groups, expense) => {
        // Use UTC date string to avoid timezone shifts
        const dateKey = expense.createdAt ? new Date(expense.createdAt).toISOString().split('T')[0] : 'Unknown';
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(expense);
        return groups;
    }, {} as Record<string, Expense[]>);

    // Sort dates descending
    const uniqueDates = Array.from(new Set(data.map(e => e.createdAt ? new Date(e.createdAt).toISOString().split('T')[0] : 'Unknown')));

    return (
        <Card className="shadow-md">
            <CardBody className="p-6">
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8 my-2">
                    {uniqueDates.map((dateKey) => (
                        <div key={dateKey} className="relative">
                            {/* Date Header */}
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-400 border-2 border-white dark:border-gray-900"></div>
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 block">
                                {dateKey === 'Unknown' ? 'Fecha desconocida' : new Date(dateKey).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    timeZone: 'UTC'
                                })}
                            </span>

                            <div className="flex flex-col gap-3">
                                {groupedExpenses[dateKey].map((expense) => (
                                    <div key={expense.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${expense.transactionType === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                <FaMoneyBillWave />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {expense.category?.name || 'Sin categoría'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {expense.category?.parent || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-bold ${expense.transactionType === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {expense.transactionType === 'INCOME' ? '+' : '-'} {formatCurrency(expense.value || 0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
