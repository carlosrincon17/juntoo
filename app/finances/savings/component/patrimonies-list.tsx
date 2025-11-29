import { Card, useDisclosure } from "@heroui/react";
import AccountCard from "./account-card";
import { FaPlus } from "react-icons/fa";
import { Patrimony } from "@/app/types/patrimony";
import { useState } from "react";
import ConfirmModal from "@/app/components/confirmModal";
import { deletePatrimony } from "../../summary/actions/patrimonies";
import PatrimonyManagerModal from "../../summary/components/patrimony-manager";

interface PatrimoniesListProps {
    patrimonies: Patrimony[],
    afterPatrimoniesChange: () => void,
}

export default function PatrimoniesList({ patrimonies, afterPatrimoniesChange }: PatrimoniesListProps) {

    const [selectedPatrimony, setSelectedPatrimony] = useState<Partial<Patrimony>>({});
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const { isOpen: isManagerModalOpen, onOpen: onManagerModalOpen, onOpenChange: onManagerModalChange } = useDisclosure();

    const onClickDeletePatrimony = (patrimony: Patrimony) => {
        setSelectedPatrimony(patrimony);
        onDeleteModalOpen();
    }

    const onClickEditPatrimony = (patrimony: Patrimony) => {
        setSelectedPatrimony(patrimony);
        onManagerModalOpen();
    }

    const onClickAddPatrimony = () => {
        setSelectedPatrimony({});
        onManagerModalOpen();
    }

    const onConfirmDeletePatrimony = async (onClose: () => void) => {
        await deletePatrimony(selectedPatrimony?.id as number);
        onClose();
        afterPatrimoniesChange();
    }
    const gradient = "from-[#2dd4bf] via-[#20c997] to-[#34d399]"

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {patrimonies.map((patrimony) => (
                    <AccountCard
                        key={patrimony.id}
                        name={patrimony.name}
                        value={patrimony.value}
                        onEdit={() => onClickEditPatrimony(patrimony)}
                        onDelete={() => onClickDeletePatrimony(patrimony)}
                        gradient={gradient}
                        textColor="text-white"
                    />
                ))}
                <Card
                    isPressable
                    onPress={onClickAddPatrimony}
                    className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-[#2dd4bf]/5 via-[#20c997]/5 to-[#34d399]/5 hover:shadow-md transition-shadow duration-300`}
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[140px] w-full">
                        <div
                            className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center p-3 mb-3 shadow-sm`}
                        >
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nueva propiedad</p>
                    </div>
                </Card>
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                title="Eliminar propiedad"
                message="¿Estás seguro de que quieres eliminar esta propiedad?"
                onConfirm={onConfirmDeletePatrimony}
            />
            <PatrimonyManagerModal
                isOpen={isManagerModalOpen}
                onOpenChange={onManagerModalChange}
                patrimony={selectedPatrimony}
                onSave={afterPatrimoniesChange}
            />
        </>
    )
}