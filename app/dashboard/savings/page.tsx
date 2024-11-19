'use client'

import { Savings } from "@/app/types/saving";
import { useEffect, useState } from "react";
import { getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import SavingsManagerModal from "./component/savings-manager";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { FaEllipsisV } from "react-icons/fa";

export default function Page() {
    const [savings, setSavings] = useState<Savings[]>([]);    
    const [loading, setLoading] = useState(true);
    const [selectedSavings, setSelectedSavings] = useState<Savings>({
        id: 0,
        name: "",
        value: 0,
        owner: "",
        userId: null,
        familyId: null,
        isInvestment: false,
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getSavingsData = async () => {
        const savingsData = await getSavings();
        setSavings(savingsData);
        setLoading(false);
    }

    const onClickSavings = (savings: Savings) => {
        setSelectedSavings(savings);
        onOpen();
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
                        <SavingsManagerModal isOpen={isOpen} savings={selectedSavings} onOpenChange={onOpenChange} />
                    </div>
            }
        </div>
    )
}