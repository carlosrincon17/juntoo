import { Savings } from "@/app/types/saving"
import { addToast, Card, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { deleteSaving } from "../actions/savings";
import AccountCard from "./account-card";
import ConfirmModal from "@/app/components/confirmModal";
import SavingsManagerModal from "../component/savings-manager";
import { FaCheck, FaPlus } from "react-icons/fa";

const savingBase: Savings = {
    id: 0,
    name: "",
    value: 0,
    owner: "",
    userId: null,
    familyId: null,
    isInvestment: false,
}

interface SavingsListProps {
    savings: Savings[],
    afterSaveSavings: () => void,
}

export default function SavingsList({
    savings,
    afterSaveSavings
}: SavingsListProps) {

    const [selectedSavings, setSelectedSavings] = useState<Savings>({ ...savingBase });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const gradient = "from-[#5a6bff] via-[#6875f5] to-[#818cf8]"

    const onClickSavings = (savings: Savings) => {
        setSelectedSavings(savings);
        onOpen();
    }

    const onClickDeleteSaving = (savings: Savings) => {
        setSelectedSavings(savings);
        onDeleteModalOpen();
    }

    const onCreateNewSavingClick = () => {
        const newSaving: Savings = { ...savingBase };
        setSelectedSavings(newSaving);
        onOpen();
    }

    const onConfirmDeleteSaving = async (onClose: () => void) => {
        await deleteSaving(selectedSavings?.id as number);
        addToast({
            title: "¡Todo en orden!",
            description: "Tu ahorro se ha eliminado correctamente",
            icon: <FaCheck size={24} />,
        });
        onClose();
        afterSaveSavings();
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {savings.map((saving) => (
                    <AccountCard
                        key={saving.id}
                        name={saving.name}
                        value={saving.value}
                        onEdit={() => onClickSavings(saving)}
                        onDelete={() => onClickDeleteSaving(saving)}
                        gradient={gradient}
                        textColor="text-white"
                        owner={saving.user?.name || ""}
                        goalName={saving.goal?.name}
                        isInvestment={saving.isInvestment}
                        annualInterestRate={saving.annualInterestRate}
                    />
                ))}
                <Card
                    className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br  from-[#5a6bff]/5 via-[#6875f5]/5 to-[#818cf8]/5 hover:shadow-md transition-shadow duration-300`}
                    onPress={onCreateNewSavingClick}
                    isPressable
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[140px]">
                        <div
                            className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center p-3 mb-3 shadow-sm`}
                        >
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nuevo ahorro</p>
                    </div>
                </Card>
            </div>
            <SavingsManagerModal isOpen={isOpen} savings={selectedSavings} onOpenChange={onOpenChange} afterSaveSavings={afterSaveSavings} />
            <ConfirmModal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange} title="Eliminar ahorro" message="¿Estás seguro de que quieres eliminar este ahorro?" onConfirm={onConfirmDeleteSaving} />

        </>
    )
}