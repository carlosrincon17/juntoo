"use client"

import { formatCurrency } from "@/app/lib/currency"
import { Button, Card, Progress } from "@heroui/react"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"

interface DebtCardProps {
    name: string
    value: number
    initialAmount: number
    onEdit: () => void
    onDelete: () => void
    gradient: string
    textColor: string
}

export default function DebtCard({
    name,
    value,
    initialAmount,
    onEdit,
    onDelete,
    gradient,
}: DebtCardProps) {

    const paidAmount = initialAmount - value;
    const progress = initialAmount > 0 ? (paidAmount / initialAmount) * 100 : 0;

    return (
        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-content1 h-full group relative">
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`}></div>

            <div className="p-5 h-full flex flex-col pt-6 relative z-10">
                <div className="mb-4">
                    <h3 className="font-medium text-sm text-gray-500 mb-1">{name}</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{formatCurrency(value)}</p>
                    <p className="text-xs font-medium text-gray-400 mt-1">Inicial: {formatCurrency(initialAmount)}</p>
                </div>

                <div className="mt-2 mb-5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Progreso de pago</span>
                        <span className="font-medium text-gray-600">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress
                        aria-label="Progreso de pago"
                        value={progress}
                        className="max-w-md"
                        size="sm"
                        classNames={{
                            track: "bg-gray-100",
                            indicator: "bg-gradient-to-r from-[#f97066] to-[#fb7185]",
                        }}
                    />
                </div>

                <div className="flex justify-end mt-auto gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="flat"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 data-[hover=true]:bg-blue-100 data-[hover=true]:text-blue-600 transition-colors"
                        onPress={onEdit}
                    >
                        <FaPencilAlt className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="flat"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 data-[hover=true]:bg-red-100 data-[hover=true]:text-red-600 transition-colors"
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
