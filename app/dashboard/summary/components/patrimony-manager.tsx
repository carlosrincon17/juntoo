import { Patrimony } from "@/app/types/patrimony";
import { Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { updatePatrimony } from "../actions/patrimonies";
import toast from "react-hot-toast";

export default function PatrimonyManagerModal(props: {
    isOpen: boolean, 
    patrimony: Patrimony
    onOpenChange: (isOpen: boolean) => void,
    onClose: () => void,
}) {
    const { isOpen, patrimony, onOpenChange, onClose } = props;

    const onSavePatrimony = async () => {
        await updatePatrimony(patrimony);
        toast.success("Patrimonio actualizado");
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
                            <Button color="primary" onPress={onSavePatrimony}>
                                    Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}