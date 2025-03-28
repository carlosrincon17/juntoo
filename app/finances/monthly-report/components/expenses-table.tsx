"use client"

import { useEffect, useState } from "react"

import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Pagination } from "@nextui-org/pagination"
import { FaArrowCircleDown, FaArrowCircleUp, FaCreditCard, FaDollarSign, FaEllipsisV } from "react-icons/fa"
import { getCountExpensesByFilter, getExpensesByFilter, removeExpense } from "@/app/actions/expenses"
import { ExpensesFilters } from "@/app/types/filters"
import { TransactionType } from "@/utils/enums/transaction-type"
import { Expense } from "@/app/types/expense"
import { formateSimpleDate } from "@/app/lib/dates"
import { formatCurrency } from "@/app/lib/currency"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import toast from "react-hot-toast"
import ToastCustom from "@/app/components/toastCustom"
import { CustomLoading } from "@/app/components/customLoading"

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

export default function FinancialTransactionsList({ expensesFilter, title = "Lista de Movimientos" }: { expensesFilter?: ExpensesFilters, title?: string }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(0)
    const [transactions, setTransactions] = useState([] as Expense[])
    const [totalItems, setTotalItems] = useState(0)
    const [isLoading, setIsLoading] = useState(true);

    const loadTotalPages = async () => {
        const totalExpenses = await getCountExpensesByFilter(expensesFilter)
        setTotalItems(totalExpenses)
    }
    const onLoadTransactions = async () => {
        setIsLoading(true);
        const transactionsCreated= await getExpensesByFilter(currentPage, itemsPerPage, expensesFilter)
        setTransactions(transactionsCreated)
        setIsLoading(false);
    }

    const handlePageSizeChange = async (newSize: number) => {
        setItemsPerPage(newSize);
        await loadTotalPages();
        setCurrentPage(1);
    }

    const deleteExpense = async (expense: Expense) => {
        setIsLoading(true);
        await removeExpense(expense);
        toast.custom((t) => <ToastCustom message={`El gasto de ${formatCurrency(expense.value as number)} por ${expense.category?.name} se ha eliminado correctamente.`} toast={t}/>);
        onLoadTransactions();
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
            {isLoading ? 
                <CustomLoading /> :
                <Card className="w-full mx-auto shadow-md p-2">
                    <CardHeader className="flex flex-col gap-2">
                        <div className="flex w-full">
                            <h3 className="text-xl font-extralight">{title}</h3>
                        </div>
                    </CardHeader>

                    <CardBody className="gap-1">
                        {transactions.length === 0 ? (
                            <div className="text-center py-4 text-default-500 text-sm">No se encontraron transacciones</div>
                        ) : (
                            transactions.map((transaction) => {
                                const colors = transactionColors[transaction.category?.transactionType as TransactionType] 

                                return (
                                    <div
                                        key={transaction.id}
                                        className={`flex items-center justify-between py-1 px-1 border-b-1 border-gray-100 bg-white transition-all ${colors.hover}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white/80 ${colors.text}`}>
                                                {getCategoryIcon(transaction.category?.transactionType as TransactionType)}
                                            </div>
                                            <div>
                                                <div className="font-light text-sm">{transaction.category?.name}</div>
                                                <div className="text-xs text-default-500 grid items-center">
                                                    <span className="text-xs text-default-500 font-light">({formateSimpleDate(transaction.createdAt as Date)})</span>
                                                    <span className="text-xs font-light text-default-500">{transaction.category?.parent}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`font-medium text-sm flex items-center ${colors.text}`}>
                                            {transaction.category?.transactionType === TransactionType.Income ? <FaArrowCircleUp className="h-3 w-3 mr-1" /> : <FaArrowCircleDown className="h-3 w-3 mr-1" />}
                                            {formatCurrency(Math.abs(transaction.value as number))}
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <FaEllipsisV className="hover:cursor-pointer mx-2 text-black"></FaEllipsisV>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Dropdown Variants" variant="flat">
                                                    <DropdownItem key="new" onClick={() => deleteExpense(transaction)}>Eliminar</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        {
                            expensesFilter ?
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-default-200 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-default-500">
                                            Mostrando {itemsPerPage} de {totalItems}
                                        </span>
                                    </div>
                                    <Pagination total={getTotalPages()} page={currentPage} onChange={setCurrentPage} showControls size="sm" />
                                </div> 
                                : 
                                null
                        }
                    </CardBody>
                </Card>
            }
        </>
    )
}

