import { Patrimony } from "@/app/types/patrimony";
import { addToast, Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { updatePatrimony } from "../actions/patrimonies";
import { FaCheck } from "react-icons/fa";

export default function PatrimonyManagerModal(props: {
    isOpen: boolean, 
    patrimony: Patrimony
    onOpenChange: (isOpen: boolean) => void,
}) {
    const { isOpen, patrimony, onOpenChange } = props;

    const onSavePatrimony = async (onClose: () => void) => {
        await updatePatrimony(patrimony);
        addToast({
            title: "¡Todo en orden!",
            description: "Tu patrimonio se ha actualizado correctamente",
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
                            <h2 className="text-2xl font-extralight"> {patrimony?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                type="number"
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                defaultValue={`${patrimony.value}`}
                                onChange={(e) => patrimony.value = parseInt(e.target.value, 10)}
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