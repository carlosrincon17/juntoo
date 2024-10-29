'use client'

import { useEffect, useState } from "react";
import BudgetsSummary from "../components/budgets-summary";
import Kpi from "../components/kpi";
import { getTotalSavings } from "../savings/actions/savings";
import { Divider } from "@nextui-org/react";
import { getTotalDebts } from "../debts/actions/debts";


export default function Page() {
    
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalDebts, setTotalDebts] = useState<number>(0);

    const getTotalSavingsData = async () => {
        const totalSavingsData = await getTotalSavings();
        setTotalSavings(totalSavingsData);
    }

    const getTotalDebtsData = async () => {
        const totalDebtsData = await getTotalDebts();
        setTotalDebts(totalDebtsData);
    }

    useEffect(() => {
        getTotalSavingsData();
        getTotalDebtsData();
    }, []);


    return (
        <div>
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
                    title="Balance" 
                    value={totalSavings - totalDebts} 
                    customClasses={["from-purple-400", "to-violet-500"]} 
                />
            </div>
            <Divider className="my-6" />
            <BudgetsSummary />
        </div>
    )
}