import { Button,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";
import ToastCustom from "@/app/components/toastCustom";
import { Loan } from "@/app/types/loans";
import { useEffect, useState } from "react";
import { createLoan, updateLoan } from "../actions/loans";
import { currencyToInteger, formatCurrency } from "@/app/lib/currency";

export default function LoansManagerModal(props: {
    isOpen: boolean, 
    loan: Loan
    onOpenChange: (isOpen: boolean) => void,
}) {
    const { isOpen, loan, onOpenChange } = props;
    const [selectedLoan, setSelectedLoan] = useState<Loan>(loan);
    const [loanValue, setLoanValue] = useState('');

    const onSaveLoan = async (onClose: () => void) => {
        const methodToUpdate = selectedLoan?.id ? updateLoan : createLoan;
        await methodToUpdate(selectedLoan as Loan);
        toast.custom((t) => <ToastCustom message="Tu patrimonio se actualizó correctamente" toast={t}/>);
        onClose();
    }

    useEffect(() => {
        setSelectedLoan({...loan});
        setLoanValue(formatCurrency(loan?.value));
    }, [loan])
    
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
                            <h2 className="text-2xl font-extralight"> {loan?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus={!Boolean(selectedLoan?.id)}
                                label="Nombre"
                                placeholder="Nombre"
                                size="lg"
                                labelPlacement="inside"
                                value={selectedLoan?.name}
                                onChange={(e) => {
                                    setSelectedLoan({...selectedLoan, name: e.target.value})
                                }}
                            />
                            <Input
                                autoFocus={Boolean(selectedLoan?.id)}
                                type="text"
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={loanValue}
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setLoanValue(formatCurrency(intValue));
                                    setSelectedLoan({...selectedLoan, value: intValue})
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">COP</span>
                                    </div>
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                                    Cerrar
                            </Button>
                            <Button color="primary" onPress={() => onSaveLoan(onClose)}>
                                    Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}