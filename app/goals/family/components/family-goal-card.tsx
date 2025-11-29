"use client"

import { FamilyGoal } from "@/app/types/family-goal";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { FaCheckCircle, FaEllipsisV, FaRegCircle, FaPlus, FaMinus } from "react-icons/fa";

interface FamilyGoalCardProps {
    goal: FamilyGoal;
    onEdit: (goal: FamilyGoal) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (goal: FamilyGoal) => void;
    onIncrement?: (goal: FamilyGoal) => void;
    onDecrement?: (goal: FamilyGoal) => void;
}

export default function FamilyGoalCard({ goal, onEdit, onDelete, onToggleComplete, onIncrement, onDecrement }: FamilyGoalCardProps) {

    const handleComplete = () => {
        onToggleComplete(goal);
    };

    const handleIncrementClick = () => {
        if (onIncrement) {
            onIncrement(goal);
        }
    };

    const handleDecrementClick = () => {
        if (onDecrement) {
            onDecrement(goal);
        }
    };

    const isItemized = goal.type === 'ITEMIZED';

    return (
        <Card className={`h-full border-none shadow-md hover:shadow-lg transition-all duration-300 ${goal.isCompleted ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-white'}`}>
            <CardHeader className="flex justify-between items-start pb-0">
                <div className="flex gap-2">
                    <Chip
                        size="sm"
                        color={goal.isCompleted ? "success" : "primary"}
                        variant="flat"
                        className="uppercase font-bold text-[10px]"
                    >
                        {goal.year}
                    </Chip>
                    {goal.isCompleted && (
                        <Chip size="sm" color="success" variant="solid" startContent={<FaCheckCircle className="ml-1" />}>
                            Completada
                        </Chip>
                    )}
                    {isItemized && (
                        <Chip size="sm" color="secondary" variant="flat" className="uppercase font-bold text-[10px]">
                            Unidades
                        </Chip>
                    )}
                </div>
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400">
                            <FaEllipsisV />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Acciones de meta">
                        <DropdownItem key="edit" onPress={() => onEdit(goal)}>Editar</DropdownItem>
                        <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => onDelete(goal.id)}>Eliminar</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </CardHeader>
            <CardBody className="py-4">
                <h3 className={`text-xl font-semibold mb-2 ${goal.isCompleted ? 'text-emerald-800' : 'text-gray-800'}`}>
                    {goal.title}
                </h3>
                {goal.description && (
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                        {goal.description}
                    </p>
                )}

                <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>Progreso</span>
                        {isItemized ? (
                            <span>{goal.currentAmount || 0} / {goal.targetAmount}</span>
                        ) : (
                            <span>{goal.progress}%</span>
                        )}
                    </div>
                    <Progress
                        value={goal.progress}
                        color={goal.isCompleted ? "success" : "primary"}
                        size="sm"
                        className="max-w-full"
                        classNames={{
                            indicator: "bg-gradient-to-r from-blue-500 to-indigo-600",
                        }}
                    />
                </div>
            </CardBody>
            <CardFooter className="pt-0 gap-2">
                {isItemized && !goal.isCompleted ? (
                    <>
                        <Button
                            isIconOnly
                            className="bg-gray-100 text-gray-600"
                            onPress={handleDecrementClick}
                            isDisabled={!goal.currentAmount || goal.currentAmount <= 0}
                        >
                            <FaMinus />
                        </Button>
                        <Button
                            className="flex-1 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            onPress={handleIncrementClick}
                            startContent={<FaPlus />}
                        >
                            Agregar
                        </Button>
                        <Button
                            isIconOnly
                            variant="bordered"
                            onPress={handleComplete}
                            className="border-emerald-200 text-emerald-600"
                        >
                            <FaCheckCircle />
                        </Button>
                    </>
                ) : (
                    <Button
                        className={`w-full font-medium ${goal.isCompleted ? 'bg-white text-emerald-600 border border-emerald-200' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'}`}
                        variant={goal.isCompleted ? "bordered" : "solid"}
                        onPress={handleComplete}
                        startContent={goal.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                    >
                        {goal.isCompleted ? "Completada" : "Marcar como completada"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
