import { Patrimony } from "@/app/types/patrimony";
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { createPatrimony, updatePatrimony } from "../actions/patrimonies";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { currencyToInteger, formatCurrency } from "@/app/lib/currency";

export default function PatrimonyManagerModal(props: {
    isOpen: boolean,
    patrimony: Partial<Patrimony>
    onOpenChange: (isOpen: boolean) => void,
    onSave: () => void
}) {
    const { isOpen, patrimony, onOpenChange, onSave } = props;
    const [currentPatrimony, setCurrentPatrimony] = useState<Partial<Patrimony>>({});
    const [value, setValue] = useState("");

    useEffect(() => {
        setCurrentPatrimony({ ...patrimony });
        setValue(formatCurrency(patrimony.value || 0));
    }, [patrimony, isOpen]);

    const onSavePatrimony = async (onClose: () => void) => {
        if (currentPatrimony.id) {
            await updatePatrimony(currentPatrimony as Patrimony);
        } else {
            await createPatrimony(currentPatrimony as Patrimony);
        }

        addToast({
            title: "¡Todo en orden!",
            description: currentPatrimony.id ? "Tu patrimonio se ha actualizado correctamente" : "Tu patrimonio se ha creado correctamente",
            icon: <FaCheck size={24} />,
        });
        onSave();
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-4 items-center">
                            <h2 className="text-2xl font-extralight"> {currentPatrimony.id ? currentPatrimony.name : "Nuevo Patrimonio"}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Nombre"
                                placeholder="Nombre del activo"
                                size="lg"
                                labelPlacement="inside"
                                value={currentPatrimony.name || ""}
                                onChange={(e) => setCurrentPatrimony({ ...currentPatrimony, name: e.target.value })}
                            />
                            <Input
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={value}
                                inputMode="numeric"
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setValue(formatCurrency(intValue));
                                    setCurrentPatrimony({ ...currentPatrimony, value: intValue });
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">$COP</span>
                                    </div>
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button color="primary" onPress={() => onSavePatrimony(onClose)}>
                                Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}