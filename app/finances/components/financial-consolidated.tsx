import { formatCurrency } from "@/app/lib/currency";
import { useEffect, useState } from "react";
import { FaCreditCard, FaPiggyBank, FaWallet } from "react-icons/fa";
import { getTotalSavings } from "../savings/actions/savings";
import { convertUsdToCop } from "@/app/actions/trm";
import { getTotalPatrimonies } from "../summary/actions/patrimonies";
import { getTotalDebts } from "../summary/actions/debts";
import { getTotalLoans } from "../summary/actions/loans";
import { Currency } from "@/utils/enums/currency";
import { CustomLoading } from "@/app/components/customLoading";

export default function FinancialConsolidated() {
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalSavingsCOP, setTotalSavingsCOP] = useState<number>(0);
    const [totalSavingsUsdInCop, setTotalSavingsUsdInCop] = useState<number | undefined>();
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
        if (totalSavingsCOP && totalSavingsUsdInCop !== undefined) {
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
            { loading ?
                <CustomLoading /> :
                <>
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FaPiggyBank className="h-4 w-4 " />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-medium">Ahorros</h3>
                                <p className="text-lg md:font-bold font-light">{formatCurrency(totalSavings)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gradient-to-r from-rose-500 to-red-500  rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FaCreditCard className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-medium">Deudas</h3>
                                <p className="text-lg md:font-bold font-light">{formatCurrency(totalDebts)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FaWallet className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-medium">Patrimonio</h3>
                                <p className="text-lg md:font-bold font-light">{formatCurrency(totalPatrimonies)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FaPiggyBank className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-medium">Balance</h3>
                                <p className="text-lg md:font-bold font-light">{formatCurrency(totalSavings + totalPatrimonies - totalDebts + totalLoans)}</p>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}