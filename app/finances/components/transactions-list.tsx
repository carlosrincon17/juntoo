import { getExpenses } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import { formateSimpleDate } from "@/app/lib/dates";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Button, Card } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaChevronRight } from "react-icons/fa";

export default function TransactionsList() {
    const [transactions, setTransactions] = useState<Expense[]>([]);

    const getTransactionsData = async () => {
        const transactionsData = await getExpenses(1, 7);
        setTransactions(transactionsData);
    }

    useEffect(() => {
        getTransactionsData();
    },  []);

    return (
        
        <Card className="border-none rounded-3xl shadow-md overflow-hidden bg-gradient-to-br from-white to-[#f9faff] p-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-[#121432]">Últimas Transacciones</h2>
                    </div>
                </div>

                <div className="space-y-2 relative z-10 mt-4">
                    {transactions.map((transaction) => (
                        <div 
                            key={transaction.id} 
                            className="group flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-white to-[#f9faff] border border-[#f0f4ff] hover:shadow-md hover:border-[#e4e9ff] transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${transaction.transactionType === TransactionType.Income ? 'from-[#2dd4bf] to-[#34d399]' : 'from-[#f97066] to-[#fb7185]'} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                                    {
                                        transaction.transactionType === TransactionType.Income ? 
                                            <FaAngleDoubleUp className="h-3 w-3 text-white" /> :
                                            <FaAngleDoubleDown className="h-3 w-3 text-white" />
                                    }
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="text-sm font-medium text-[#121432]">{transaction.category?.name}</h5>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs font-light text-[#121432]/60">{formateSimpleDate(transaction.createdAt as Date)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span 
                                    className={`text-base font-medium ${
                                        transaction.transactionType === TransactionType.Income
                                            ? 'bg-gradient-to-r from-[#2dd4bf] to-[#34d399] bg-clip-text text-transparent' 
                                            : 'bg-gradient-to-r from-[#f97066] to-[#fb7185] bg-clip-text text-transparent'
                                    }`}
                                >
                                    {transaction.transactionType === TransactionType.Income ? '+' : '-'} {formatCurrency(transaction.value || 0)}
                                </span>
                                <div 
                                    className="text-[10px] font-light text-white px-2 py-0.5 rounded-full bg-[#121432]/70"
                                >
                                    {transaction.category?.parent}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between relative z-10">
                    <Button variant="light" size="lg" className="text-xs font-normal flex items-center w-full">
                        Ver todas <FaChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}