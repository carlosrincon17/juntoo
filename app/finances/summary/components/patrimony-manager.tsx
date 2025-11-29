import { Patrimony } from "@/app/types/patrimony";
import { addToast, Button, Input } from "@heroui/react";
import { createPatrimony, updatePatrimony } from "../actions/patrimonies";
import { FaCheck, FaTimes } from "react-icons/fa";
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

    const onSavePatrimony = async () => {
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
                        <h2 className="text-2xl font-extralight"> {currentPatrimony.id ? currentPatrimony.name : "Nuevo Patrimonio"}</h2>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <Input
                            autoFocus={!Boolean(currentPatrimony.id)}
                            label="Nombre"
                            placeholder="Nombre del activo"
                            size="lg"
                            labelPlacement="inside"
                            value={currentPatrimony.name || ""}
                            onChange={(e) => setCurrentPatrimony({ ...currentPatrimony, name: e.target.value })}
                        />
                        <Input
                            autoFocus={Boolean(currentPatrimony.id)}
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
                    </div>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button color="primary" size="lg" onPress={onSavePatrimony} className="w-full">
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}