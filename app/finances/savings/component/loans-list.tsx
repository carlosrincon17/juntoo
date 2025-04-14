import { addToast, Card, useDisclosure } from "@heroui/react";
import AccountCard from "./account-card";
import { FaCheck, FaPlus } from "react-icons/fa";
import { Loan } from "@/app/types/loans";
import ConfirmModal from "@/app/components/confirmModal";
import { deleteLoan } from "../../summary/actions/loans";
import { useState } from "react";

interface LoanListProps {
    loans: Loan[],
    afterLoansChange: () => void,
}

export default function LoansList({ loans, afterLoansChange }: LoanListProps) {

    const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange} = useDisclosure();
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    const onClickDeleteLoan = (loan: Loan) => {
        setSelectedLoan(loan);
        onDeleteModalOpen();
    }

    const onConfirmDeleteLoan = async (onClose: () => void) => {
        await deleteLoan(selectedLoan?.id as number);
        addToast({
            title: "¡Todo en orden!",
            description: "Tu prestamo se ha eliminado correctamente",
            icon: <FaCheck size={24} />,
        });
        setSelectedLoan(null);
        afterLoansChange();
        onClose();
    }
    const gradient = "from-[#f97066] via-[#f43f5e] to-[#fb7185]"

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {loans.map((loan) => (
                    <AccountCard 
                        key={loan.id} 
                        name={loan.name} 
                        value={loan.value} 
                        onEdit={() => console.log(loan)} 
                        onDelete={() => onClickDeleteLoan(loan)} 
                        gradient={gradient}
                        textColor="text-white"
                    />
                ))}
                <Card
                    className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-[#f97066]/5 via-[#f43f5e]/5 to-[#fb7185]/5 hover:shadow-md transition-shadow duration-300`}
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[140px]">
                        <div
                            className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center p-3 mb-3 shadow-sm`}
                        >
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nueva prestamo</p>
                    </div>
                </Card>
            </div>
            <ConfirmModal 
                isOpen={isDeleteModalOpen} 
                onOpenChange={onDeleteModalChange} 
                title="Eliminar prestamo" 
                message="¿Estás seguro de que quieres eliminar este prestamo?" 
                onConfirm={onConfirmDeleteLoan}
            />
                    
        </>
    )
}