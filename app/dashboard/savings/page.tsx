'use client'

import { Savings } from "@/app/types/saving";
import { useEffect, useState } from "react";
import { getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import SavingsManagerModal from "./component/savings-manager";
import { useDisclosure } from "@nextui-org/react";

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
                                    onClick={() => onClickSavings(saving)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">{saving.owner}</h2>
                                            <p className="text-sm text-gray-500">{saving.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-medium text-gray-900">{formatCurrency(saving.value)}</p>
                                            <p className="text-sm text-gray-500">{saving.currency}</p>
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