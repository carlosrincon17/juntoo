import { addToast, Card, useDisclosure } from "@heroui/react";
import DebtCard from "./debt-card";
import { FaCheck, FaPlus } from "react-icons/fa";
import { Debts } from "@/app/types/debts";
import { useState } from "react";
import { deleteDebt } from "../../summary/actions/debts";
import ConfirmModal from "@/app/components/confirmModal";
import DebtManagerModal from "../../summary/components/debts-manager";

interface DebtsListProps {
    debts: Debts[],
    afterDebtsChange: () => void,
}

export default function DebtsList({ debts, afterDebtsChange }: DebtsListProps) {
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const { isOpen: isManagerModalOpen, onOpen: onManagerModalOpen, onOpenChange: onManagerModalChange } = useDisclosure();
    const [selectedDebt, setSelectedDebt] = useState<Partial<Debts>>({});

    const gradient = "from-[#f97066] via-[#f43f5e] to-[#fb7185]"

    const onClickDeleteDebt = (debt: Debts) => {
        setSelectedDebt(debt);
        onDeleteModalOpen();
    }

    const onClickEditDebt = (debt: Debts) => {
        setSelectedDebt(debt);
        onManagerModalOpen();
    }

    const onClickAddDebt = () => {
        setSelectedDebt({});
        onManagerModalOpen();
    }

    const onConfirmDeleteDebt = async (onClose: () => void) => {
        await deleteDebt(selectedDebt?.id as number);
        addToast({
            title: "¡Todo en orden!",
            description: "Tu deuda se ha eliminado correctamente",
            icon: <FaCheck size={24} />,
        });
        setSelectedDebt({});
        afterDebtsChange();
        onClose();
    }
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {debts.map((debt) => (
                    <DebtCard
                        key={debt.id}
                        name={debt.name}
                        value={debt.value}
                        initialAmount={debt.initialAmount}
                        onEdit={() => onClickEditDebt(debt)}
                        onDelete={() => onClickDeleteDebt(debt)}
                        gradient={gradient}
                        textColor="text-white"
                    />
                ))}
                <Card
                    isPressable
                    onPress={onClickAddDebt}
                    className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-[#f97066]/5 via-[#f43f5e]/5 to-[#fb7185]/5 hover:shadow-md transition-shadow duration-300`}
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[140px] w-full">
                        <div
                            className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center p-3 mb-3 shadow-sm`}
                        >
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nueva deuda</p>
                    </div>
                </Card>
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                title="Eliminar deuda"
                message="¿Estás seguro de que quieres eliminar esta deuda?"
                onConfirm={onConfirmDeleteDebt}
            />
            <DebtManagerModal
                isOpen={isManagerModalOpen}
                onOpenChange={onManagerModalChange}
                debt={selectedDebt}
                onSave={afterDebtsChange}
            />
        </>
    )
}