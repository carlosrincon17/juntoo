"use client"

import { Button, Input, ScrollShadow, Textarea } from "@heroui/react";
import { useState, useEffect } from "react";
import { FaIdCard, FaTimes } from "react-icons/fa";
import { createImportantId, deleteImportantId } from "../actions/ids";

interface ImportantIdDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: () => void;
}

export default function ImportantIdDrawer({ isOpen, onOpenChange, onSave }: ImportantIdDrawerProps) {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setValue("");
            setDescription("");
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!name || !value) return;

        setIsLoading(true);
        try {
            await createImportantId(name, value, description || undefined);
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving important ID:", error);
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
                            <FaIdCard className="text-indigo-500" />
                            <h2 className="text-2xl font-extralight">
                                Nuevo Registro
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
                                label="Título o Nombre"
                                placeholder="Ej: CENS Apartamento"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="bordered"
                                className="bg-white"
                                isRequired
                            />

                            <Input
                                label="Valor"
                                placeholder="Ej: 123000444"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                variant="bordered"
                                className="bg-white"
                                isRequired
                            />

                            <Textarea
                                label="Descripción"
                                placeholder="Ej: Código de barras factura"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="bordered"
                                className="bg-white"
                            />
                        </div>
                    </ScrollShadow>

                    <div className="p-4 border-t flex justify-end gap-2 bg-white">
                        <Button
                            color="primary"
                            onPress={handleSave}
                            isLoading={isLoading}
                            isDisabled={!name || !value}
                            className="w-full shadow-md font-semibold"
                        >
                            Guardar Registro
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
