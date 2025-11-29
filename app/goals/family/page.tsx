"use client"

import { useEffect, useState } from "react";
import { FamilyGoal } from "@/app/types/family-goal";
import { getFamilyGoals, deleteFamilyGoal, updateFamilyGoal } from "@/app/actions/family-goals";
import FamilyGoalCard from "./components/family-goal-card";
import FamilyGoalDrawer from "./components/family-goal-drawer";
import YearSelector from "./components/year-selector";
import { Button, useDisclosure, Card } from "@heroui/react";
import { FaPlus, FaRocket } from "react-icons/fa";
import { CustomLoading } from "@/app/components/customLoading";
import ConfirmModal from "@/app/components/confirmModal";

export default function FamilyGoalsPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [goals, setGoals] = useState<FamilyGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGoal, setSelectedGoal] = useState<Partial<FamilyGoal>>({});

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange } = useDisclosure();
    const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

    const loadGoals = async () => {
        setLoading(true);
        const data = await getFamilyGoals(year);
        setGoals(data);
        setLoading(false);
    };

    useEffect(() => {
        loadGoals();
    }, [year]);

    const handleCreate = () => {
        setSelectedGoal({ year });
        onOpen();
    };

    const handleEdit = (goal: FamilyGoal) => {
        setSelectedGoal(goal);
        onOpen();
    };

    const handleDeleteClick = (id: number) => {
        setGoalToDelete(id);
        onDeleteOpen();
    };

    const confirmDelete = async (onClose: () => void) => {
        if (goalToDelete) {
            await deleteFamilyGoal(goalToDelete);
            loadGoals();
        }
        onClose();
    };

    const handleToggleComplete = async (goal: FamilyGoal) => {
        const updatedGoal = {
            ...goal,
            isCompleted: !goal.isCompleted,
            progress: !goal.isCompleted ? 100 : goal.progress // Auto-set progress to 100 if completing
        };
        await updateFamilyGoal(updatedGoal);
        loadGoals();
    };

    const handleIncrement = async (goal: FamilyGoal) => {
        if (goal.type !== 'ITEMIZED' || !goal.targetAmount) return;

        const newAmount = (goal.currentAmount || 0) + 1;
        const updatedGoal = {
            ...goal,
            currentAmount: newAmount,
            progress: Math.min(Math.round((newAmount / goal.targetAmount) * 100), 100),
            isCompleted: newAmount >= goal.targetAmount
        };
        await updateFamilyGoal(updatedGoal);
        loadGoals();
    };

    const handleDecrement = async (goal: FamilyGoal) => {
        if (goal.type !== 'ITEMIZED' || !goal.currentAmount || goal.currentAmount <= 0) return;

        const newAmount = goal.currentAmount - 1;
        const updatedGoal = {
            ...goal,
            currentAmount: newAmount,
            progress: goal.targetAmount ? Math.min(Math.round((newAmount / goal.targetAmount) * 100), 100) : 0,
            isCompleted: goal.targetAmount ? newAmount >= goal.targetAmount : false
        };
        await updateFamilyGoal(updatedGoal);
        loadGoals();
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-light text-gray-900 flex items-center gap-3">
                        <FaRocket className="text-indigo-500" />
                        Metas Familiares
                    </h1>
                    <p className="text-gray-500 mt-2 font-light text-lg">
                        Creciendo juntos, un logro a la vez.
                    </p>
                </div>
                <div className="w-full md:w-auto flex items-center gap-4">
                    <YearSelector year={year} onChange={setYear} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <CustomLoading />
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-2xl font-medium text-gray-700 mb-2">Aún no hay metas para {year}</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Este es el comienzo de algo grande. ¡Define qué quieren lograr como familia este año!
                    </p>
                    <Button color="primary" variant="flat" onPress={handleCreate}>
                        Crear primera meta
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => (
                        <FamilyGoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            onToggleComplete={handleToggleComplete}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                        />
                    ))}
                    <Card
                        className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 hover:shadow-md transition-shadow duration-300 min-h-[200px]`}
                        onPress={handleCreate}
                        isPressable
                    >
                        <div className="p-6 h-full flex flex-col items-center justify-center">
                            <div
                                className={`rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-4 mb-4 shadow-sm`}
                            >
                                <FaPlus className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-base font-medium text-gray-700">Nueva Meta</p>
                            <p className="text-xs text-gray-500 mt-1">Define un nuevo objetivo</p>
                        </div>
                    </Card>
                </div>
            )}

            <FamilyGoalDrawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                goal={selectedGoal}
                year={year}
                onSave={loadGoals}
            />

            <ConfirmModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteChange}
                title="Eliminar meta"
                message="¿Estás seguro de que quieres eliminar esta meta? No podrás recuperarla."
                onConfirm={confirmDelete}
            />
        </div>
    );
}
