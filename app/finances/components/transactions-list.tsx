'use client'

import { getExpenses, removeExpense } from "@/app/actions/expenses";
import ConfirmModal from "@/app/components/confirmModal";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { addToast, Button, ButtonGroup, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Key, useEffect, useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaCheck, FaChevronRight, FaTimesCircle } from "react-icons/fa";

import { ExpensesFilters } from "@/app/types/filters";

export default function TransactionsList({ filter }: { filter?: ExpensesFilters }) {
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [transactionTypeSelected, setTransactionTypeSelected] = useState<TransactionType>(TransactionType.Outcome);
    const [currentTransactionsPage, setCurrentTransactionsPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);

    const getTransactionsData = async () => {
        const transactionsData = await getExpenses(currentTransactionsPage, 7, transactionTypeSelected, filter);
        if (currentTransactionsPage == 1) {
            setTransactions(transactionsData);
        } else {
            setTransactions([...transactions, ...transactionsData]);
        }
        setLoading(false);
    }

    const getColorByTransactionType = (transactionType: TransactionType) => {
        return transactionType === transactionTypeSelected ? 'primary' : 'default';
    }

    const onLoadMoreTransactions = async () => {
        setCurrentTransactionsPage(currentTransactionsPage + 1);
    }

    const executeTransactionAction = async (action: Key, transaction: Expense) => {
        if (action === 'delete') {
            setSelectedTransaction(transaction);
            onDeleteModalOpen();
        }
    };

    const onConfirmDeleteTransaction = async (onClose: () => void) => {
        if (selectedTransaction) {
            await removeExpense(selectedTransaction);
            setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
            addToast({
                title: 'Transacción eliminada',
                description: 'La transacción ha sido eliminada correctamente.',
                icon: <FaCheck size={24} />,
            })
            setSelectedTransaction(null);
            onClose();
        }
    }

    useEffect(() => {
        getTransactionsData();
    }, [currentTransactionsPage]);

    useEffect(() => {
        getTransactionsData();
    }, [filter]);

    useEffect(() => {
        setCurrentTransactionsPage(1);
        getTransactionsData();
    }, [transactionTypeSelected]);

    useEffect(() => {
        setCurrentTransactionsPage(1);
    }, [transactionTypeSelected]);

    if (loading) {
        return (
            <Card>
                <CardBody className="p-4">
                    <div className="flex justify-center items-center">
                        <CustomLoading className="mt-24" />
                    </div>
                </CardBody>
            </Card>
        )
    }

    if (transactions.length === 0) {
        return null;
    }
    return (

        <Card className="border-none rounded-3xl shadow-md overflow-hidden bg-gradient-to-br from-white to-[#f9faff] p-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
            <div className="flex items-center justify-between content-center">
                <h2 className="text-xl font-extralight">Ultimas transacciones </h2>
                <ButtonGroup variant="flat" size="sm">
                    <Button
                        color={getColorByTransactionType(TransactionType.Outcome)}
                        onPress={() => setTransactionTypeSelected(TransactionType.Outcome)}
                    >
                        Gastos
                    </Button>
                    <Button
                        color={getColorByTransactionType(TransactionType.Income)}
                        onPress={() => setTransactionTypeSelected(TransactionType.Income)}
                    >
                        Ingresos
                    </Button>
                </ButtonGroup>
            </div>
            <div className="space-y-8 relative mt-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700 my-2">
                {Array.from(new Set(transactions.map(e => e.createdAt ? new Date(e.createdAt).toISOString().split('T')[0] : 'Unknown'))).map((dateKey) => {
                    const dateTransactions = transactions.filter(t => (t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : 'Unknown') === dateKey);

                    return (
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
                                {dateTransactions.map((transaction) => (
                                    <Dropdown key={transaction.id}>
                                        <DropdownTrigger className="w-full">
                                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${transaction.transactionType === TransactionType.Income ? 'from-[#2dd4bf] to-[#34d399]' : 'from-[#f97066] to-[#fb7185]'} flex items-center justify-center shadow-sm`}>
                                                        {transaction.transactionType === TransactionType.Income ?
                                                            <FaAngleDoubleUp className="h-4 w-4 text-white" /> :
                                                            <FaAngleDoubleDown className="h-4 w-4 text-white" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {transaction.category?.name || 'Sin categoría'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {transaction.category?.parent || 'General'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-lg font-bold ${transaction.transactionType === TransactionType.Income ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {transaction.transactionType === TransactionType.Income ? '+' : '-'} {formatCurrency(transaction.value || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Transaction options" className="w-full" onAction={(action) => { executeTransactionAction(action, transaction) }}>
                                            <DropdownItem
                                                key="delete"
                                                startContent={<FaTimesCircle className="text-danger" />}
                                            >
                                                Eliminar movimiento
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                title="Eliminar transacción"
                message="¿Estás seguro de que quieres eliminar esta transacción?"
                onConfirm={onConfirmDeleteTransaction}
            />
            <div className="mt-4 flex items-center justify-between relative">
                <Button
                    variant="light"
                    size="lg"
                    className="text-xs font-normal flex items-center w-full"
                    onPress={onLoadMoreTransactions}
                >
                    Ver más <FaChevronRight className="h-3 w-3 ml-1" />
                </Button>
            </div>
        </Card>
    )
}