'use client'

import { BudgetWithExpenses } from "@/app/types/budget";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { deactivateBudget, deleteBudget, getBudgetsActiveWithExpenses } from "../actions/bugdets";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";
import { FaEllipsisV } from "react-icons/fa";
import ConfirmModal from "@/app/components/confirmModal";

export default function BudgetList() {

    const [activeBudgets, setActiveBudgets] = useState<BudgetWithExpenses[]>([]);
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedBudget, setSelectedBudget] = useState<BudgetWithExpenses>();

    const getBudgetsData = async () => {
        setLoading(true);
        const budgets = await getBudgetsActiveWithExpenses();
        setLoading(false);
        setActiveBudgets(budgets);
    }

    const onDeleteBudget = async (budget: BudgetWithExpenses) => {
        setSelectedBudget(budget);
        onOpen()
    }

    const onConfirmDeleteBudget = async (onClose: () => void) => {
        await deleteBudget(selectedBudget?.id as number);
        onClose();
        getBudgetsData();
    }

    const onInactiveBudget = async (budget: BudgetWithExpenses) => {
        await deactivateBudget(budget.id);
        getBudgetsData();
    }

    const getColorBudget = (budget: BudgetWithExpenses) => {
        const totalAvailable = budget.value - budget.totalExpenses;
        const limitOrange = budget.value * 0.5;
        const limitRed = budget.value * 0.2;
        if (totalAvailable < limitRed)
            return "text-red-700";
        if (totalAvailable < limitOrange)
            return "text-orange-700";
        return "text-green-700";
    }

    const getConfirmationDeleteMessage = () => {
        return `Esta acción eliminará el presupuesto ${selectedBudget?.name}, está seguro de hacerlo?`;
    }

    const renderBudget = (budget: BudgetWithExpenses) => {
        const totalAvailable = budget.value - budget.totalExpenses;
        const percentageUsed = (budget.totalExpenses / budget.value) * 100;
        const percentageAvailable = (totalAvailable / budget.value) * 100;
        const colorName = getColorBudget(budget);
        return (
            <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white w-full"
                key={budget.id}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{budget.name}</h2>
                    </div>
                    <div className="text-right">
                        <Dropdown>
                            <DropdownTrigger>
                                <FaEllipsisV className="hover:cursor-pointer"></FaEllipsisV>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem onClick={() => onInactiveBudget(budget)}>
                                Finalizar
                                </DropdownItem>
                                <DropdownItem className="text-danger"onClick={() => onDeleteBudget(budget)}>
                                Eliminar
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="px-4 py-4">
                    <div className="grid mb-4 flex-row grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(budget.value)}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-sm font-medium text-gray-500">Disponible</p>
                            <p className={"text-2xl font-bold " + colorName}>{formatCurrency(budget.value - budget.totalExpenses)}</p>
                        </div>
                    </div>
                    <Progress 
                        aria-label="Budget progress" 
                        value={percentageUsed} 
                        className="h-3"
                        classNames={{
                            base: "max-w-md",
                            track: "drop-shadow-md border border-default",
                            indicator: "bg-gradient-to-r from-sky-500 to-emerald-500",
                            label: "tracking-wider font-medium text-default-600",
                            value: "text-foreground/60",
                        }}
                    />
                    <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-500">{formatCurrency(budget.totalExpenses)} usado</p>
                        <p className="text-sm text-gray-500">{percentageAvailable.toFixed(1)}% disponible</p>
                    </div>
                </div>
            </div>
        )
    };

    useEffect(() => {
        getBudgetsData();
    }, []);

    return (
        <>
            { loading ?
                <CustomLoading /> :
                <div className="full-width">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {activeBudgets.map((budget) => renderBudget(budget))}
                    </div>
                    <ConfirmModal 
                        isOpen={isOpen} 
                        onOpenChange={onOpenChange} 
                        onConfirm={onConfirmDeleteBudget} 
                        title="Confirmación"
                        message={getConfirmationDeleteMessage()}>
                    </ConfirmModal>
                </div>
            }
        </>
    )
}