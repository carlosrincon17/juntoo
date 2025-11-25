"use client"

import { Button, Card, Progress } from "@heroui/react"
import { FaPencilAlt, FaTrashAlt, FaTrophy } from "react-icons/fa"
import AnimatedNumber from "@/app/components/animated-number"

interface GoalCardProps {
    name: string
    value: number
    currentAmount: number
    onEdit: () => void
    onDelete: () => void
}

export default function GoalCard({
    name,
    value,
    currentAmount,
    onEdit,
    onDelete,
}: GoalCardProps) {

    const percentage = Math.min((currentAmount / value) * 100, 100);
    const isCompleted = currentAmount >= value;

    return (
        <Card className="overflow-hidden border-none shadow-md rounded-2xl bg-white h-full group hover:shadow-lg transition-all duration-300">
            <div className="p-6 relative h-full flex flex-col">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-yellow-500/10 transition-colors"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <FaTrophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{name}</h3>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <span className="text-xl font-light text-gray-900">
                                    <AnimatedNumber value={currentAmount} />
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    / <AnimatedNumber value={value} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {Math.round(percentage)}%
                        </span>
                    </div>
                </div>

                <div className="space-y-2 mb-6 relative z-10">
                    <Progress
                        aria-label={`Progreso de ${name}`}
                        size="sm"
                        value={currentAmount}
                        maxValue={value}
                        classNames={{
                            base: "max-w-full",
                            track: "bg-gray-100 h-2",
                            indicator: isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-blue-500 to-indigo-500",
                        }}
                    />
                    {!isCompleted && (
                        <div className="text-right">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                Faltan <AnimatedNumber value={value - currentAmount} />
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-auto gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-500"
                        onPress={onEdit}
                    >
                        <FaPencilAlt className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
