'use client'

import { useEffect, useState } from "react";
import Kpi from "../components/kpi";
import { getTotalSavings } from "../savings/actions/savings";
import { Divider, useDisclosure } from "@nextui-org/react";
import { getTotalDebts } from "./actions/debts";
import DebtsList from "./components/debts-list";
import PatrimonyList from "./components/patrimony-list";
import { getTotalPatrimonies } from "./actions/patrimonies";
import PatrimonyManagerModal from "./components/patrimony-manager";
import { Patrimony } from "@/app/types/patrimony";


export default function Page() {
    
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalDebts, setTotalDebts] = useState<number>(0);
    const [totalPatrimonies, setTotalPatrimonies] = useState<number>(0);
    const [selectedPatrimony, setSelectedPatrimony] = useState<Patrimony>({
        id: 0,
        name: "",
        value: 0
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getTotalSavingsData = async () => {
        const totalSavingsData = await getTotalSavings();
        setTotalSavings(totalSavingsData);
    }

    const getTotalPatrimoniesData = async () => {
        const totalPatrimoniesData = await getTotalPatrimonies();
        setTotalPatrimonies(totalPatrimoniesData);
    }

    const getTotalDebtsData = async () => {
        const totalDebtsData = await getTotalDebts();
        setTotalDebts(totalDebtsData);
    }

    const onSelectPatrimony = (patrimony: Patrimony) => {
        setSelectedPatrimony(patrimony);
        onOpen()
    }

    useEffect(() => {
        getTotalSavingsData();
        getTotalDebtsData();
        getTotalPatrimoniesData();
    }, []);


    return (
        <div>
            <div className="mb-6">
                <Kpi 
                    title="Balance" 
                    value={totalSavings + totalPatrimonies - totalDebts} 
                    customClasses={["from-cyan-500", "to-blue-300", "text-black"]} 
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Kpi 
                    title="Ahorros" 
                    value={totalSavings} 
                    customClasses={["from-cyan-400", "to-green-500"]} 
                />
                <Kpi 
                    title="Deudas" 
                    value={totalDebts} 
                    customClasses={["from-rose-400", "to-red-500"]} 
                />
                <Kpi 
                    title="Patrimonio"
                    value={totalPatrimonies} 
                    customClasses={["from-purple-400", "to-violet-500"]} 
                />
            </div>
            <Divider className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-2xl font-light mb-4">Deudas</h3>
                    <DebtsList />
                </div>
                <div>
                    <h3 className="text-2xl font-light mb-4">Patrimonio</h3>
                    <PatrimonyList onSelectPatrimony={(patrimony) => onSelectPatrimony(patrimony)} />
                    <PatrimonyManagerModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onOpen} patrimony={selectedPatrimony}/>
                </div>
            </div>
        </div>
    )
}