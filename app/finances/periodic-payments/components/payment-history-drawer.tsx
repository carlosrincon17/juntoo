"use client"

import { Button, ScrollShadow, Spinner } from "@heroui/react"
import { useEffect, useState } from "react"
import { getPeriodicPaymentExpenses } from "@/app/actions/periodic-payments"
import { FaHistory, FaMoneyBillWave, FaTimes } from "react-icons/fa"

interface PaymentHistoryDrawerProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    periodicPaymentId: number
    paymentName: string
}

interface Expense {
    id: number
    value: number
    createdAt: Date
    category?: {
        name: string
        color: string
    } | null
}

export default function PaymentHistoryDrawer({ isOpen, onOpenChange, periodicPaymentId, paymentName }: PaymentHistoryDrawerProps) {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen && periodicPaymentId) {
            const fetchHistory = async () => {
                setIsLoading(true)
                try {
                    const data = await getPeriodicPaymentExpenses(periodicPaymentId)
                    // Cast dates to Date objects if they come as strings from server action serialization
                    const formattedData = data.map((item) => ({
                        ...item,
                        id: item.id || 0,
                        value: item.value || 0,
                        createdAt: new Date(item.createdAt || new Date())
                    }))
                    setExpenses(formattedData)
                } catch (error) {
                    console.error("Failed to fetch payment history:", error)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchHistory()
        }
    }, [isOpen, periodicPaymentId])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => onOpenChange(false)}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-1/3 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <FaHistory className="text-primary" />
                                <h2 className="text-xl font-bold">Historial de Pagos</h2>
                            </div>
                            <p className="text-sm text-gray-500 font-normal">
                                {paymentName}
                            </p>
                        </div>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-900">
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex justify-center py-10">
                                    <Spinner label="Cargando historial..." color="primary" />
                                </div>
                            ) : expenses.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No hay pagos registrados para este ítem.
                                </div>
                            ) : (
                                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6 my-4">
                                    {expenses.map((expense) => (
                                        <div key={expense.id} className="relative">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-white dark:border-gray-900"></div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    {expense.createdAt.toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full bg-primary/10 text-primary`}>
                                                            <FaMoneyBillWave />
                                                        </div>
                                                        <span className="font-medium">Pago realizado</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {formatCurrency(expense.value)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollShadow>
                </div>
            </div>
        </>
    )
}
