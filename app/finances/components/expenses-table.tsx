"use client"

import { useEffect, useState } from "react"

import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Pagination } from "@nextui-org/pagination"
import { FaArrowCircleDown, FaArrowCircleUp, FaCreditCard, FaDollarSign } from "react-icons/fa"
import { getCountExpensesByFilter, getExpensesByFilter } from "@/app/actions/expenses"
import { ExpensesFilters } from "@/app/types/filters"
import { TransactionType } from "@/utils/enums/transaction-type"
import { Expense } from "@/app/types/expense"
import { formateSimpleDate } from "@/app/lib/dates"
import { formatCurrency } from "@/app/lib/currency"

const getCategoryIcon = (category: TransactionType) => {
    switch (category) {
    case TransactionType.Income:
        return <FaDollarSign className="h-3.5 w-3.5" />
    default:
        return <FaCreditCard className="h-3.5 w-3.5" />
    }
}

const transactionColors = {
    [TransactionType.Income]: {
        light: "bg-[#E8F5E9]",
        text: "text-[#2E7D32]",
        hover: "hover:bg-[#C8E6C9]",
        border: "border-[#A5D6A7]",
    },
    [TransactionType.Outcome]: {
        light: "bg-[#FFEBEE]",
        text: "text-[#C62828]",
        hover: "hover:bg-[#FFCDD2]",
        border: "border-[#EF9A9A]",
    },
}

export default function FinancialTransactionsList({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(0)
    const [transactions, setTransactions] = useState([] as Expense[])
    const [totalItems, setTotalItems] = useState(0)

    const loadTotalPages = async () => {
        const totalExpenses = await getCountExpensesByFilter(expensesFilter)
        setTotalItems(totalExpenses)
    }
    const onLoadTransactions = async () => {
        const transactionsCreated= await getExpensesByFilter(currentPage, itemsPerPage, expensesFilter)
        setTransactions(transactionsCreated)
    }

    const handlePageSizeChange = async (newSize: number) => {
        setItemsPerPage(newSize);
        await loadTotalPages();
        setCurrentPage(1);
    }

    const getTotalPages = () => {
        if (!itemsPerPage || !totalItems) return 0;
        return Math.ceil(totalItems / itemsPerPage)
    }   

    useEffect(() => {
        onLoadTransactions()
    }, [currentPage, itemsPerPage]) 

    useEffect(() => {
        handlePageSizeChange(10)
    }, []);

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto bg-[#FAFAFA]">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex w-full">
                        <h3 className="text-xl font-light mb-4">Lista de Movimientos</h3>
                    </div>
                </CardHeader>

                <CardBody className="gap-2">
                    {transactions.length === 0 ? (
                        <div className="text-center py-4 text-default-500 text-sm">No se encontraron transacciones</div>
                    ) : (
                        transactions.map((transaction) => {
                            const colors = transactionColors[transaction.category?.transactionType as TransactionType] 

                            return (
                                <div
                                    key={transaction.id}
                                    className={`flex items-center justify-between py-2 px-3 rounded-medium border-1 transition-all ${colors.hover}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white/80 ${colors.text}`}>
                                            {getCategoryIcon(transaction.category?.transactionType as TransactionType)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{transaction.category?.name}</div>
                                            <div className="text-xs text-default-500 grid items-center gap-1">
                                                {formateSimpleDate(transaction.createdAt as Date)}
                                                <span className="capitalize">{transaction.category?.parent}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-medium text-sm flex items-center ${colors.text}`}>
                                        {transaction.category?.transactionType === TransactionType.Income ? <FaArrowCircleUp className="h-3 w-3 mr-1" /> : <FaArrowCircleDown className="h-3 w-3 mr-1" />}
                                        {formatCurrency(Math.abs(transaction.value as number))}
                                    </div>
                                </div>
                            )
                        })
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 pt-4 border-t border-default-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-default-500">
                                Mostrando {itemsPerPage} de {totalItems}
                            </span>
                        </div>

                        <Pagination total={getTotalPages()} page={currentPage} onChange={setCurrentPage} showControls size="sm" />
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

