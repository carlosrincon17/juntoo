import { formatCurrency } from "@/app/lib/currency";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { FaChevronLeft, FaChevronRight, FaTrashAlt } from "react-icons/fa";

export default function ExpensesTable(props: { 
    expenses: Expense[],
    perPage: number,
    currentPage: number,
    countExpenses: number,
    onPageChange: (page: number) => void,
    onDeleteExpense: (expense: Expense) => void
}) {
    const { expenses, onPageChange, currentPage, countExpenses, onDeleteExpense } = props;
    const totalPages = Math.floor(countExpenses);

    return (
        <div className="w-full">
            <div className="gap-4 flex flex-wrap">
                {expenses.map((expense) => (
                    <div 
                        key={expense.id}
                        className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white w-full"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{expense.createdBy}</span>
                                    <span className={`text-sm text-gray-700`}>{expense.category?.name}</span>
                                </div>
                            </div>
                  
                            <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    expense.transactionType === TransactionType.Outcome 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {expense.transactionType === TransactionType.Income ? 'Ingreso' : 'Gasto'}
                                </span>
                    
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(expense.value || 0)}
                                    </span>
                                    <span className="text-sm text-gray-500">{new Date(expense.createdAt?.toUTCString() as string).toLocaleDateString('es-CO')}</span>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span>
                                        <FaTrashAlt onClick={() => onDeleteExpense(expense)} className="text-red-600 cursor-pointer" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
                </span>
            
                <div className="flex space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <FaChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
              
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <FaChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}