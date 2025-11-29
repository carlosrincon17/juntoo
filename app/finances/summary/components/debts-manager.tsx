import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Debts } from "@/app/types/debts";
import { createDebt, updateDebt } from "../actions/debts";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { currencyToInteger, formatCurrency } from "@/app/lib/currency";

export default function DebtManagerModal(props: {
    isOpen: boolean,
    debt: Partial<Debts>
    onOpenChange: (isOpen: boolean) => void,
    onSave: () => void
}) {
    const { isOpen, debt, onOpenChange, onSave } = props;
    const [currentDebt, setCurrentDebt] = useState<Partial<Debts>>({});
    const [value, setValue] = useState("");
    const [initialAmount, setInitialAmount] = useState("");

    useEffect(() => {
        setCurrentDebt({ ...debt });
        setValue(formatCurrency(debt.value || 0));
        setInitialAmount(formatCurrency(debt.initialAmount || 0));
    }, [debt, isOpen]);

    const onSaveDebt = async (onClose: () => void) => {
        if (currentDebt.id) {
            await updateDebt(currentDebt as Debts);
        } else {
            await createDebt(currentDebt as Debts);
        }

        addToast({
            title: "¡Todo en orden!",
            description: currentDebt.id ? "Tu deuda se ha actualizado correctamente" : "Tu deuda se ha creado correctamente",
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
                            <h2 className="text-2xl font-extralight"> {currentDebt.id ? currentDebt.name : "Nueva Deuda"}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Nombre"
                                placeholder="Nombre de la deuda"
                                size="lg"
                                labelPlacement="inside"
                                value={currentDebt.name || ""}
                                onChange={(e) => setCurrentDebt({ ...currentDebt, name: e.target.value })}
                            />
                            <Input
                                label="Valor Actual"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={value}
                                inputMode="numeric"
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setValue(formatCurrency(intValue));
                                    setCurrentDebt({ ...currentDebt, value: intValue });
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">$COP</span>
                                    </div>
                                }
                            />
                            <Input
                                label="Monto Inicial"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={initialAmount}
                                inputMode="numeric"
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setInitialAmount(formatCurrency(intValue));
                                    setCurrentDebt({ ...currentDebt, initialAmount: intValue });
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
                            <Button color="primary" onPress={() => onSaveDebt(onClose)}>
                                Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}