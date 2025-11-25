"use client"

import { FinancialGoal } from "@/app/types/financial-goal"
import { addToast, Button, Input } from "@heroui/react"
import { useEffect, useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa"
import { addFinancialGoal, updateFinancialGoal } from "../../actions/financial-goals"
import { currencyToInteger, formatCurrency } from "@/app/lib/currency"

interface GoalModalProps {
    isOpen: boolean
    goal: FinancialGoal
    onOpenChange: (isOpen: boolean) => void
    afterSaveGoal: () => void
}

export default function GoalModal({
    isOpen,
    goal,
    onOpenChange,
    afterSaveGoal
}: GoalModalProps) {
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal>({ ...goal })
    const [goalValue, setGoalValue] = useState("")

    const onSaveGoal = async () => {
        const saveMethod = selectedGoal.id ? updateFinancialGoal : addFinancialGoal
        await saveMethod(selectedGoal)

        const message = selectedGoal.id
            ? "Tu meta se actualizó correctamente"
            : "Tu meta se creó correctamente"

        addToast({
            description: message,
            title: "¡Todo en orden!",
            icon: <FaCheck size={24} />,
        })

        onOpenChange(false)
        afterSaveGoal()
    }

    useEffect(() => {
        setSelectedGoal({ ...goal })
        setGoalValue(formatCurrency(goal.value))
    }, [isOpen, goal])

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => onOpenChange(false)} />

            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-2xl font-extralight">{goal.id ? "Editar Meta" : "Nueva Meta"}</h2>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <Input
                            autoFocus={!Boolean(goal.id)}
                            label="Nombre"
                            placeholder="Ej: Viaje a Europa"
                            size="lg"
                            labelPlacement="inside"
                            value={selectedGoal.name}
                            onChange={(e) => {
                                setSelectedGoal({ ...selectedGoal, name: e.target.value })
                            }}
                        />
                        <Input
                            autoFocus={Boolean(goal.id)}
                            label="Valor Objetivo"
                            placeholder="0"
                            size="lg"
                            labelPlacement="inside"
                            value={goalValue}
                            inputMode="numeric"
                            onChange={(e) => {
                                const intValue = currencyToInteger(e.target.value)
                                setGoalValue(formatCurrency(intValue))
                                setSelectedGoal({ ...selectedGoal, value: intValue })
                            }}
                            endContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">COP</span>
                                </div>
                            }
                        />
                    </div>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button
                            color="primary"
                            size="lg"
                            onPress={onSaveGoal}
                            className="w-full"
                            isDisabled={!selectedGoal.name || selectedGoal.value <= 0}
                        >
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
