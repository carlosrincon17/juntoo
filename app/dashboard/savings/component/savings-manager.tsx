import { Savings } from "@/app/types/saving";
import { Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";
import { updateSavings } from "../actions/savings";
import ToastCustom from "@/app/components/toastCustom";
import { useEffect, useState } from "react";
import { currencyToInteger, formatCurrency } from "@/app/lib/currency";

export default function SavingsManagerModal(props: {
    isOpen: boolean, 
    savings: Savings
    onOpenChange: (isOpen: boolean) => void,
}) {
    const { isOpen, savings, onOpenChange } = props;
    const [savingsValue, setSavingsValue] = useState('');

    const onSaveSavings = async (onClose: () => void) => {
        await updateSavings(savings);
        toast.custom((t) => <ToastCustom message="Tus ahorros se actualizaron correctamente" toast={t}/>);
        onClose();
    }

    useEffect(() => {
        setSavingsValue(formatCurrency(savings.value));
        console.log(savingsValue);
    }, [isOpen])
    
    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="center"
            size="2xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-4 items-center">
                            <h2 className="text-2xl font-extralight"> {savings?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={savingsValue}
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setSavingsValue(formatCurrency(intValue));
                                    savings.value = intValue
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">{savings.currency}</span>
                                    </div>
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                                    Cerrar
                            </Button>
                            <Button color="primary" onPress={() => onSaveSavings(onClose)}>
                                    Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}