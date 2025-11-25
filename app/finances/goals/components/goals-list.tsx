"use client"

import { FinancialGoal } from "@/app/types/financial-goal"
import { addToast, Card, useDisclosure } from "@heroui/react"
import { useEffect, useState } from "react"
import { FaCheck, FaPlus } from "react-icons/fa"
import { getFinancialGoals, removeFinancialGoal } from "../../actions/financial-goals"
import ConfirmModal from "@/app/components/confirmModal"
import { CustomLoading } from "@/app/components/customLoading"
import GoalCard from "./goal-card"
import GoalModal from "./goal-modal"

const emptyGoal: FinancialGoal = {
    id: 0,
    name: "",
    value: 0,
    familyId: 0,
    currentAmount: 0
}

export default function GoalsList() {
    const [goals, setGoals] = useState<FinancialGoal[]>([])
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal>(emptyGoal)
    const [loading, setLoading] = useState(true)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onOpenChange: onDeleteModalChange
    } = useDisclosure()

    const loadGoals = async () => {
        const data = await getFinancialGoals()
        setGoals(data)
        setLoading(false)
    }

    useEffect(() => {
        loadGoals()
    }, [])

    const handleCreate = () => {
        setSelectedGoal(emptyGoal)
        onOpen()
    }

    const handleEdit = (goal: FinancialGoal) => {
        setSelectedGoal(goal)
        onOpen()
    }

    const handleDelete = (goal: FinancialGoal) => {
        setSelectedGoal(goal)
        onDeleteModalOpen()
    }

    const onConfirmDelete = async (onClose: () => void) => {
        await removeFinancialGoal(selectedGoal)
        addToast({
            title: "¡Todo en orden!",
            description: "Tu meta se ha eliminado correctamente",
            icon: <FaCheck size={24} />,
        })
        onClose()
        loadGoals()
    }

    if (loading) {
        return <CustomLoading />
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {goals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        name={goal.name}
                        value={goal.value}
                        currentAmount={goal.currentAmount || 0}
                        onEdit={() => handleEdit(goal)}
                        onDelete={() => handleDelete(goal)}
                    />
                ))}

                <Card
                    className="overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-yellow-500/5 via-yellow-400/5 to-yellow-300/5 hover:shadow-md transition-shadow duration-300 min-h-[200px]"
                    onPress={handleCreate}
                    isPressable
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center">
                        <div className="rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 flex items-center justify-center p-3 mb-3 shadow-sm">
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nueva Meta</p>
                    </div>
                </Card>
            </div>

            <GoalModal
                isOpen={isOpen}
                goal={selectedGoal}
                onOpenChange={onOpenChange}
                afterSaveGoal={loadGoals}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                title="Eliminar meta"
                message="¿Estás seguro de que quieres eliminar esta meta? Esta acción no se puede deshacer."
                onConfirm={onConfirmDelete}
            />
        </>
    )
}
