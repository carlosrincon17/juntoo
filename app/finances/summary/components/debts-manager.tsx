import { addToast, Button, Input } from "@heroui/react";
import { Debts } from "@/app/types/debts";
import { createDebt, updateDebt } from "../actions/debts";
import { FaCheck, FaTimes } from "react-icons/fa";
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

    const onSaveDebt = async () => {
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
        onOpenChange(false);
    }

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
                        <h2 className="text-2xl font-extralight"> {currentDebt.id ? currentDebt.name : "Nueva Deuda"}</h2>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <Input
                            autoFocus={!Boolean(currentDebt.id)}
                            label="Nombre"
                            placeholder="Nombre de la deuda"
                            size="lg"
                            labelPlacement="inside"
                            value={currentDebt.name || ""}
                            onChange={(e) => setCurrentDebt({ ...currentDebt, name: e.target.value })}
                        />
                        <Input
                            autoFocus={Boolean(currentDebt.id)}
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
                    </div>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button color="primary" size="lg" onPress={onSaveDebt} className="w-full">
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}