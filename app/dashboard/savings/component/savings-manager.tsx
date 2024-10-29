import { Savings } from "@/app/types/saving";
import { Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";
import { updateSavings } from "../actions/savings";

export default function SavingsManagerModal(props: {
    isOpen: boolean, 
    savings: Savings
    onOpenChange: (isOpen: boolean) => void,
    onClose: () => void,
}) {
    const { isOpen, savings, onOpenChange, onClose } = props;

    const onSaveSavings = async () => {
        await updateSavings(savings);
        toast.success("Ahorros actualizado");
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
                            <h2 className="text-2xl font-extralight"> {savings?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                type="number"
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                defaultValue={`${savings.value}`}
                                onChange={(e) => savings.value = parseInt(e.target.value, 10)}
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
                            <Button color="primary" onPress={onSaveSavings}>
                                    Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}