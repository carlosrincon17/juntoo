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
        owner: ""
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

    const getSavingsGradient = (saving: Savings) => {
        if (saving.owner === 'Carlos')
            return 'from-blue-500 to-green-500';
        if (saving.owner === 'Maye')
            return 'from-rose-500 to-amber-500';
        return 'from-blue-500 to-green-500';
    }
        
    return (
        <div>
            {
                loading ? 
                    <CustomLoading /> :
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {savings.map((saving) => (
                                <div className={`bg-gradient-to-br ${getSavingsGradient(saving)} p-6 rounded-lg shadow-lg text-gray-200 hover:cursor-pointer`} 
                                    key={saving.id} 
                                    onClick={() => onClickSavings(saving)}
                                >
                                    <h2 className="text-2xl font-light mb-2">{saving.owner} <span className="text-small font-light">({saving.name})</span></h2>
                                    <p className="font-bold text-right">Total: {formatCurrency(saving.value)}</p>
                                </div>
                            ))}
                        </div>
                        <SavingsManagerModal isOpen={isOpen} savings={selectedSavings} onOpenChange={onOpenChange} />
                    </div>
            }
        </div>
    )
}