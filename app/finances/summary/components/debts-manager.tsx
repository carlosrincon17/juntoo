import { addToast, Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Debts } from "@/app/types/debts";
import { updateDebt } from "../actions/debts";
import { FaCheck } from "react-icons/fa";

export default function DebtManagerModal(props: {
    isOpen: boolean, 
    debt: Debts
    onOpenChange: (isOpen: boolean) => void,
}) {
    const { isOpen, debt, onOpenChange } = props;

    const onSaveDebt = async (onClose: () => void) => {
        await updateDebt(debt);
        addToast({
            title: "¡Todo en orden!",
            description: "Tu deuda se ha actualizado correctamente",
            icon: <FaCheck size={24} />,
        });
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
                            <h2 className="text-2xl font-extralight"> {debt?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                type="number"
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                defaultValue={`${debt.value}`}
                                onChange={(e) => debt.value = parseInt(e.target.value, 10)}
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