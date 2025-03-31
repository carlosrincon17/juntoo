'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

export default function ConfirmModal(props: { 
    isOpen: boolean, 
    onOpenChange: (isOpen: boolean) => void,
    onConfirm: (onClose: () => void) => void,
    title: string,
    message: string,
}) {
    const { isOpen, onOpenChange, onConfirm, title, message } = props;

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
                            <h2 className="text-2xl font-extralight"> {title}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-gray-500">{message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" color="default" onPress={onClose}>
                                Cancerlar
                            </Button>
                            <Button color="primary" variant="flat" onPress={() => onConfirm(onClose)}>
                                Confirmar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}