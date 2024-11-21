'use client'

import { Savings } from "@/app/types/saving";
import { useEffect, useState } from "react";
import { deleteSaving, getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import SavingsManagerModal from "./component/savings-manager";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import ConfirmModal from "@/app/components/confirmModal";

const savingBase: Savings = {
    id: 0,
    name: "",
    value: 0,
    owner: "",
    userId: null,
    familyId: null,
    isInvestment: false,
}

export default function Page() {
    const [savings, setSavings] = useState<Savings[]>([]);    
    const [loading, setLoading] = useState(true);
    const [selectedSavings, setSelectedSavings] = useState<Savings>({...savingBase});
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange} = useDisclosure();

    const getSavingsData = async () => {
        setLoading(true);
        const savingsData = await getSavings();
        setSavings(savingsData);
        setLoading(false);
    }

    const afterSaveSavings = async () => {
        getSavingsData();
    }

    const onClickSavings = (savings: Savings) => {
        setSelectedSavings(savings);
        onOpen();
    }

    const onClickDeleteSaving = (savings: Savings) => {
        setSelectedSavings(savings);
        onDeleteModalOpen();
    }

    const onCreateNewSavingClick = async () => {
        const newSaving: Savings = {...savingBase};
        setSelectedSavings(newSaving);
        onOpen();
    }

    const onConfirmDeleteSaving = async (onClose: () => void) => {
        await deleteSaving(selectedSavings?.id as number);
        onClose();
        getSavingsData();
    }
    useEffect(() => {
        getSavingsData();
    }, []);

    return (
        <div>
            {
                loading ? 
                    <CustomLoading /> :
                    <div>
                        <div className="flex w-full flex-wrap flex-row-reverse justify-items-end">
                            <Button onClick={onCreateNewSavingClick} color="primary" variant="shadow" className="w-full md:w-auto">
                                <FaPlus /> Agregar ahorro
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {savings.map((saving) => (
                                <div className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                                    key={saving.id} 
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">{saving.name}</h2>
                                        </div>
                                        <div className="text-right">
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <FaEllipsisV className="hover:cursor-pointer"></FaEllipsisV>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Static Actions">
                                                    <DropdownItem onClick={() => onClickSavings(saving)}>
                                                        Editar
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => onClickDeleteSaving(saving)} className="text-red-600">
                                                        Eliminar
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="grid flex-row grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(saving.value)}</p>
                                            <p className="text-sm font-medium text-gray-500">{saving.currency}</p>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-sm font-medium text-gray-500">Interes anual</p>
                                            <p className={"text-2xl font-bold text-green-500"}>{
                                                saving.isInvestment ? 
                                                    <span> {saving.annualInterestRate} % </span>:
                                                    <span className="text-gray-500"> -- </span>
                                            }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <SavingsManagerModal isOpen={isOpen} savings={selectedSavings} onOpenChange={onOpenChange} afterSaveSavings={afterSaveSavings} />
                        <ConfirmModal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange} title="Eliminar ahorro" message="¿Estás seguro de que quieres eliminar este ahorro?" onConfirm={onConfirmDeleteSaving} />
                    </div>
            }
        </div>
    )
}