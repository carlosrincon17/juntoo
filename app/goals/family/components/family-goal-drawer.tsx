"use client"

import { FamilyGoal } from "@/app/types/family-goal";
import { addToast, Button, Input, ScrollShadow, Textarea, RadioGroup, Radio, Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaRocket } from "react-icons/fa";
import { createFamilyGoal, updateFamilyGoal } from "@/app/actions/family-goals";

interface FamilyGoalDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    goal: Partial<FamilyGoal>;
    year: number;
    onSave: () => void;
}

export default function FamilyGoalDrawer({ isOpen, onOpenChange, goal, year, onSave }: FamilyGoalDrawerProps) {
    const [currentGoal, setCurrentGoal] = useState<Partial<FamilyGoal>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCurrentGoal({ ...goal, year: goal.year || year });
    }, [goal, isOpen, year]);

    const handleSave = async () => {
        if (!currentGoal.title) return;

        setIsLoading(true);
        try {
            if (currentGoal.id) {
                await updateFamilyGoal(currentGoal as FamilyGoal);
            } else {
                await createFamilyGoal(currentGoal);
            }

            addToast({
                title: "¡Excelente!",
                description: currentGoal.id ? "Meta actualizada correctamente" : "Nueva meta creada",
                icon: <FaCheck size={24} />,
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving goal:", error);
            addToast({
                title: "Error",
                description: "No se pudo guardar la meta",
                color: "danger",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                        <div className="flex items-center gap-2">
                            <FaRocket className="text-indigo-500" />
                            <h2 className="text-2xl font-extralight">
                                {currentGoal.id ? "Editar Meta" : "Nueva Meta"}
                            </h2>
                        </div>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="p-6 space-y-6">
                            <Input
                                autoFocus
                                label="Título"
                                placeholder="Ej: Leer 12 libros en familia"
                                value={currentGoal.title || ""}
                                onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                                variant="bordered"
                                className="bg-white"
                            />

                            <Textarea
                                label="Descripción"
                                placeholder="Detalles adicionales..."
                                value={currentGoal.description || ""}
                                onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
                                variant="bordered"
                                className="bg-white"
                            />

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <RadioGroup
                                    label="Tipo de Meta"
                                    orientation="horizontal"
                                    value={currentGoal.type || 'BOOLEAN'}
                                    onValueChange={(value) => setCurrentGoal({ ...currentGoal, type: value as 'BOOLEAN' | 'ITEMIZED' })}
                                >
                                    <Radio value="BOOLEAN">Simple (Sí/No)</Radio>
                                    <Radio value="ITEMIZED">Por Unidades</Radio>
                                </RadioGroup>
                            </div>

                            {currentGoal.type === 'ITEMIZED' && (
                                <Input
                                    type="number"
                                    label="Meta de Unidades"
                                    placeholder="Ej: 12"
                                    value={currentGoal.targetAmount?.toString() || ""}
                                    onChange={(e) => setCurrentGoal({ ...currentGoal, targetAmount: Number(e.target.value) })}
                                    variant="bordered"
                                    className="bg-white"
                                />
                            )}

                            {currentGoal.id && currentGoal.type === 'BOOLEAN' && (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Progreso: {currentGoal.progress}%</label>
                                    <Slider
                                        aria-label="Progreso"
                                        step={5}
                                        maxValue={100}
                                        minValue={0}
                                        value={currentGoal.progress || 0}
                                        onChange={(v) => setCurrentGoal({ ...currentGoal, progress: v as number })}
                                        className="max-w-md"
                                    />
                                </div>
                            )}
                        </div>
                    </ScrollShadow>

                    <div className="p-4 border-t flex justify-end gap-2 bg-white">
                        <Button
                            color="primary"
                            onPress={handleSave}
                            isLoading={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-semibold"
                        >
                            {currentGoal.id ? "Actualizar Meta" : "Guardar Meta"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
