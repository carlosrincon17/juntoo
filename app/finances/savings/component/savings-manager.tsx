"use client"

import type { Savings } from "@/app/types/saving"
import { addToast, Button, Checkbox, Input, Select, SelectItem, type SharedSelection } from "@heroui/react"
import { createSavings, updateSavings } from "../actions/savings"
import { useEffect, useState } from "react"
import { currencyToInteger, formatCurrency } from "@/app/lib/currency"
import { FaCheck, FaTimes } from "react-icons/fa"

import { getFinancialGoals } from "../../actions/financial-goals"
import { FinancialGoal } from "@/app/types/financial-goal"

export default function SavingsManagerPanel(props: {
    isOpen: boolean
    savings: Savings
    onOpenChange: (isOpen: boolean) => void
    afterSaveSavings: () => void
}) {
    const { isOpen, savings, onOpenChange, afterSaveSavings } = props
    const [savingsValue, setSavingsValue] = useState("")
    const [selectedSavings, setSelectedSavings] = useState<Savings>()
    const [goals, setGoals] = useState<FinancialGoal[]>([])

    const onSaveSavings = async () => {
        const savingMethod = selectedSavings?.id ? updateSavings : createSavings
        await savingMethod(selectedSavings as Savings)
        const message = selectedSavings?.id
            ? "Tus ahorros se actualizaron correctamente"
            : "Tus ahorros se agregaron correctamente"
        addToast({
            description: message,
            title: "¡Todo en orden!",
            icon: <FaCheck size={24} />,
        });
        onOpenChange(false)
        afterSaveSavings()
    }

    useEffect(() => {
        const fetchGoals = async () => {
            const goalsData = await getFinancialGoals()
            setGoals(goalsData)
        }
        fetchGoals()
    }, [])

    useEffect(() => {
        setSelectedSavings({ ...savings })
        setSavingsValue(formatCurrency(savings.value))
    }, [isOpen, savings])

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => onOpenChange(false)}
            />

            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">

                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-2xl font-extralight">{savings?.name || "Nuevo Ahorro"}</h2>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    {/* Cuerpo */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <Input
                            autoFocus={!Boolean(selectedSavings?.id)}
                            label="Nombre"
                            placeholder="Nombre"
                            size="lg"
                            labelPlacement="inside"
                            value={selectedSavings?.name}
                            onChange={(e) => {
                                setSelectedSavings({ ...(selectedSavings as Savings), name: e.target.value })
                            }}
                        />
                        <Input
                            autoFocus={Boolean(selectedSavings?.id)}
                            label="Valor"
                            placeholder="0"
                            size="lg"
                            labelPlacement="inside"
                            value={savingsValue}
                            inputMode="numeric"
                            onChange={(e) => {
                                const intValue = currencyToInteger(e.target.value)
                                setSavingsValue(formatCurrency(intValue))
                                setSelectedSavings({ ...(selectedSavings as Savings), value: intValue })
                            }}
                            endContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">{savings.currency}</span>
                                </div>
                            }
                        />
                        <Select
                            items={[
                                { label: "USD", key: "USD" },
                                { label: "COP", key: "COP" },
                            ]}
                            label="Moneda"
                            selectedKeys={[selectedSavings?.currency as string]}
                            multiple={false}
                            isRequired
                            onSelectionChange={(e: SharedSelection) => {
                                setSelectedSavings({ ...(selectedSavings as Savings), currency: e.currentKey as string })
                            }}
                            placeholder="Seleccione una moneda"
                            size="lg"
                        >
                            {(currency) => <SelectItem key={currency.key}>{currency.label}</SelectItem>}
                        </Select>

                        <Select
                            items={goals}
                            label="Meta Financiera"
                            selectedKeys={selectedSavings?.goalId ? [selectedSavings.goalId.toString()] : []}
                            onSelectionChange={(e: SharedSelection) => {
                                setSelectedSavings({ ...(selectedSavings as Savings), goalId: Number(e.currentKey) })
                            }}
                            placeholder="Seleccione una meta (opcional)"
                            size="lg"
                        >
                            {(goal) => <SelectItem key={goal.id}>{goal.name}</SelectItem>}
                        </Select>

                        <Checkbox
                            size="lg"
                            isSelected={selectedSavings?.isInvestment}
                            onValueChange={(status: boolean) =>
                                setSelectedSavings({ ...(selectedSavings as Savings), isInvestment: status })
                            }
                        >
                            Es una inversión con interes anual
                        </Checkbox>
                        {selectedSavings?.isInvestment && (
                            <Input
                                label="Tasa de interés anual"
                                placeholder="Tasa de interés anual"
                                size="lg"
                                type="number"
                                labelPlacement="inside"
                                max={100}
                                defaultValue={selectedSavings?.annualInterestRate?.toString()}
                                onChange={(e) => {
                                    const intValue = Number.parseInt(e.target.value, 10)
                                    setSelectedSavings({ ...(selectedSavings as Savings), annualInterestRate: intValue })
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">%</span>
                                    </div>
                                }
                            />
                        )}
                    </div>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button color="primary" size="lg" onPress={onSaveSavings} className="w-full">
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

