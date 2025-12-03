"use client"

import { FamilyGoal } from "@/app/types/family-goal";
import { addToast, Button, Input, Slider, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { createFamilyGoal, updateFamilyGoal } from "@/app/actions/family-goals";

interface FamilyGoalManagerPanelProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    goal: Partial<FamilyGoal>;
    year: number;
    onSave: () => void;
}

export default function FamilyGoalManagerPanel({ isOpen, onOpenChange, goal, year, onSave }: FamilyGoalManagerPanelProps) {
    const [currentGoal, setCurrentGoal] = useState<Partial<FamilyGoal>>({});

    useEffect(() => {
        setCurrentGoal({ ...goal, year: goal.year || year });
    }, [goal, isOpen, year]);

    const handleSave = async () => {
        if (!currentGoal.title) return;

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
    };

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
                        <h2 className="text-2xl font-extralight">{currentGoal.id ? "Editar Meta" : "Nueva Meta"}</h2>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <Input
                            autoFocus={!Boolean(currentGoal.id)}
                            label="Título"
                            placeholder="Ej: Leer 12 libros"
                            size="lg"
                            labelPlacement="inside"
                            value={currentGoal.title || ""}
                            onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                        />

                        <Textarea
                            label="Descripción"
                            placeholder="Detalles adicionales sobre cómo lograr esta meta..."
                            size="lg"
                            labelPlacement="inside"
                            value={currentGoal.description || ""}
                            onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
                            minRows={3}
                        />

                        {currentGoal.id && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-gray-700">Progreso</label>
                                    <span className="text-sm text-gray-500">{currentGoal.progress}%</span>
                                </div>
                                <Slider
                                    aria-label="Progreso"
                                    step={5}
                                    maxValue={100}
                                    minValue={0}
                                    value={currentGoal.progress || 0}
                                    onChange={(v) => setCurrentGoal({ ...currentGoal, progress: v as number })}
                                    className="max-w-full"
                                    color="primary"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button color="primary" size="lg" onPress={handleSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
                            Guardar Meta
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
