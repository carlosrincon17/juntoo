import { Category } from "@/app/types/category";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function NewExpenseModal(props: {
    isOpen: boolean, 
    onOpenChange: (isOpen: boolean) => void,
    onSaveExpense: (onClose: () => void, expense: Expense) => void,
    category: Category | null,
}) {
    const { isOpen, onOpenChange, onSaveExpense, category } = props;
    const [expense, setExpense] = useState<Expense>({
        value: 0,
        category_id: 0,
        budgetId: null
    });

    useEffect(() => {
        setExpense({ value: 0, category_id: 0, budgetId: null});
    }, [isOpen]);
    
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
                            <h2 className="text-2xl font-extralight"> {category?.name}</h2>
                            <Chip color="primary" size="sm" variant="flat">
                                {category?.parent}
                            </Chip>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                type="number"
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={`${expense.value}`}
                                onChange={(e) => setExpense({...expense, value: parseInt(e.target.value, 10)})}
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
                            <Button color="primary" onPress={() => onSaveExpense(onClose, expense)}>
                                    Agregar {category?.transactionType === TransactionType.Outcome ? 'Gasto' : 'Ingreso'}  
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}