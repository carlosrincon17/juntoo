'use client'

import { getExpenses, removeExpense } from "@/app/actions/expenses";
import ConfirmModal from "@/app/components/confirmModal";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { formateSimpleDate } from "@/app/lib/dates";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { addToast, Button, ButtonGroup, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Key, useEffect, useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaCheck, FaChevronRight, FaTimesCircle } from "react-icons/fa";

export default function TransactionsList() {
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [transactionTypeSelected, setTransactionTypeSelected] = useState<TransactionType>(TransactionType.Outcome);
    const [currentTransactionsPage, setCurrentTransactionsPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);

    const getTransactionsData = async () => {
        const transactionsData = await getExpenses(currentTransactionsPage, 7, transactionTypeSelected);
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
    }, []);

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
            <div className="space-y-2 relative mt-3">
                {transactions.map((transaction) => (
                    <Dropdown
                        key={transaction.id}
                    >
                        <DropdownTrigger className="w-full">
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
                                        className={`text-base font-medium ${transaction.transactionType === TransactionType.Income
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