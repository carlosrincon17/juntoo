'use client'

import { useEffect, useState } from "react";
import { getTotalSavings } from "../savings/actions/savings";
import { Divider } from "@nextui-org/react";
import { getTotalDebts } from "./actions/debts";
import { getTotalPatrimonies } from "./actions/patrimonies";
import Feedback from "./components/feedback";
import { Currency } from "@/utils/enums/currency";
import { convertUsdToCop } from "@/app/actions/trm";
import { CustomLoading } from "@/app/components/customLoading";
import { getTotalLoans } from "./actions/loans";
import FinancialOverview from "./components/financial-overview";
import FinancialBalanceCard from "./components/financial-balance-card";
import TransactionsSummaryCard from "./components/transaction-summary";


export default function Page() {
    
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalSavingsCOP, setTotalSavingsCOP] = useState<number>(0);
    const [totalSavingsUsdInCop, setTotalSavingsUsdInCop] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const [totalDebts, setTotalDebts] = useState<number>(0);
    const [totalPatrimonies, setTotalPatrimonies] = useState<number>(0);
    const [totalLoans, setTotalLoans] = useState<number>(0);


    const getTotalSavingsData = async () => {
        const totalSavingsData = await getTotalSavings();
        setTotalSavingsCOP(totalSavingsData);
    }

    const getTotalSavingsUSDData = async () => {
        const totalSavingsUSDData = await getTotalSavings(Currency.USD);
        const savingsUsdInCop = await convertUsdToCop(totalSavingsUSDData);
        setTotalSavingsUsdInCop(Number(savingsUsdInCop));
    }

    const getTotalPatrimoniesData = async () => {
        const totalPatrimoniesData = await getTotalPatrimonies();
        setTotalPatrimonies(Number(totalPatrimoniesData));
    }

    const getTotalDebtsData = async () => {
        const totalDebtsData = await getTotalDebts();
        setTotalDebts(Number(totalDebtsData));
    }

    const getTotalLoansData = async () => {
        const totalLoansData = await getTotalLoans();
        setTotalLoans(Number(totalLoansData));
    }


    useEffect(() => { 
        if (totalSavingsCOP && totalSavingsUsdInCop) {
            setTotalSavings(+totalSavingsCOP + totalSavingsUsdInCop);
            setLoading(false);
        }
    }, [totalSavingsCOP, totalSavingsUsdInCop]);

    useEffect(() => {
        getTotalSavingsData();
        getTotalSavingsUSDData();
        getTotalDebtsData();
        getTotalPatrimoniesData();
        getTotalLoansData();
    }, []);


    return (
        <> 
            {
                loading ?
                    <CustomLoading /> :
                    <div className="w-full max-w-7xl mx-auto space-y-6">
                        <div className="flex items-start justify-start max-h-full flex-wrap">
                            <div className="grid grid-cols-1 gap-4 w-full md:w-1/3">
                                <h1 className="text-2xl font-light mb-2">Resumen</h1>
                                <FinancialBalanceCard 
                                    patrimony={totalPatrimonies}
                                    savings={totalSavings}
                                    debt={totalDebts}
                                />
                                <TransactionsSummaryCard 
                                    income={96000000}
                                    outcome={80000000}
                                />
                                <Feedback patrimonies={totalPatrimonies} savings={totalSavings + totalLoans} debts={totalDebts} />
                            </div>
                            <Divider orientation="vertical" className="bg-gray-800"/>
                            <div className="grid grid-cols-1 sm:ml-6 sm:px-4  max-h-full overflow-y-auto md-w-2/3 mt-6 sm:mt-0">
                                <FinancialOverview />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}