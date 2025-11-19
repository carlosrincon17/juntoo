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
    textColor,
}: DebtCardProps) {

    const paidAmount = initialAmount - value;
    const progress = initialAmount > 0 ? (paidAmount / initialAmount) * 100 : 0;

    return (
        <Card className={`overflow-hidden border-none shadow-md rounded-2xl bg-gradient-to-br ${gradient} h-full`}>
            <div className="p-6 relative h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                <div className="flex justify-between items-start mb-4 relative">
                    <div className="w-full grid gap-2">
                        <h3 className={`font-light text-sm ${textColor}/90`}>{name}</h3>
                        <div>
                            <p className={`text-2xl font-extralight ${textColor}`}>{formatCurrency(value)}</p>
                            <p className={`text-xs font-light ${textColor}/80`}>Inicial: {formatCurrency(initialAmount)}</p>
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/80 mb-1">
                                <span>Progreso</span>
                                <span>{progress.toFixed(0)}%</span>
                            </div>
                            <Progress
                                aria-label="Progreso de pago"
                                value={progress}
                                className="max-w-md"
                                color="default"
                                size="sm"
                                classNames={{
                                    track: "bg-white/20",
                                    indicator: "bg-white",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-auto gap-2 relative">
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className={`h-8 w-8 rounded-full bg-white/20 hover:bg-white/30`}
                        onPress={onEdit}
                    >
                        <FaPencilAlt className="h-4 w-4 text-white" />
                    </Button>
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className={`h-8 w-8 rounded-full bg-white/20 hover:bg-white/30`}
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
