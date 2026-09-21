'use client'

import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { FaCamera, FaCheck } from "react-icons/fa";
import { createConsolidatedSnapshot } from "../actions/snapshots";

interface TakeSnapshotModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSaved?: () => void;
}

export default function TakeSnapshotModal({
    isOpen,
    onOpenChange,
    onSaved,
}: TakeSnapshotModalProps) {
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (onClose: () => void) => {
        setIsSaving(true);
        try {
            await createConsolidatedSnapshot(note);
            addToast({
                title: "¡Snapshot guardado!",
                description: "Quedó registrada una foto del consolidado actual",
                icon: <FaCheck size={24} />,
            });
            setNote("");
            onSaved?.();
            onClose();
        } catch (error) {
            console.error("Error creating snapshot", error);
            addToast({
                title: "No se pudo guardar",
                description: "Intenta tomar el snapshot de nuevo",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setNote("");
                }
                onOpenChange(open);
            }}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-3 items-center">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <FaCamera size={14} />
                            </div>
                            <h2 className="text-xl font-semibold tracking-tight">Tomar snapshot</h2>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-gray-500">
                                Se guardará el estado actual de ahorros, patrimonio y deudas para ver cómo evolucionan tus finanzas.
                            </p>
                            <Input
                                label="Nota (opcional)"
                                placeholder="Ej: Cierre de septiembre, venta del carro..."
                                value={note}
                                onValueChange={setNote}
                                variant="bordered"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" color="default" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => handleSave(onClose)}
                                isLoading={isSaving}
                                startContent={!isSaving ? <FaCamera /> : undefined}
                            >
                                Guardar snapshot
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
