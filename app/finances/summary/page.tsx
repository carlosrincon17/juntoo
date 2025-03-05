'use client'

import { useEffect, useState } from "react";
import Kpi from "../components/kpi";
import { getTotalSavings } from "../savings/actions/savings";
import { Button, Divider, useDisclosure } from "@nextui-org/react";
import { getTotalDebts } from "./actions/debts";
import DebtsList from "./components/debts-list";
import PatrimonyList from "./components/patrimony-list";
import { getTotalPatrimonies } from "./actions/patrimonies";
import PatrimonyManagerModal from "./components/patrimony-manager";
import { Patrimony } from "@/app/types/patrimony";
import Feedback from "./components/feedback";
import { Debts } from "@/app/types/debts";
import DebtManagerModal from "./components/debts-manager";
import { FINANCE_ROUTES } from "@/utils/navigation/routes-constants";
import { useRouter } from "next/navigation";
import { Currency } from "@/utils/enums/currency";
import { convertUsdToCop } from "@/app/actions/trm";
import { CustomLoading } from "@/app/components/customLoading";
import LoanList from "./components/loans-list";
import { FaPlus } from "react-icons/fa";
import LoansManagerModal from "./components/loans-manager";
import { Loan } from "@/app/types/loans";
import { getTotalLoans } from "./actions/loans";
import FinancialOverview from "./components/financial-overview";

const baseLoan: Loan = {
    id: 0,
    name: "",
    value: 0,
    familyId: 0,
}

export default function Page() {
    
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalSavingsCOP, setTotalSavingsCOP] = useState<number>(0);
    const [totalSavingsUsdInCop, setTotalSavingsUsdInCop] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const [totalDebts, setTotalDebts] = useState<number>(0);
    const [totalPatrimonies, setTotalPatrimonies] = useState<number>(0);
    const [totalLoans, setTotalLoans] = useState<number>(0);
    const [selectedPatrimony, setSelectedPatrimony] = useState<Patrimony>({
        id: 0,
        name: "",
        value: 0,
        familyId: null,
    });
    const [selectedDebt, setSelectedDebt] = useState<Debts>({
        id: 0,
        name: "",
        value: 0,
        familyId: null,
    });
    const [selectedLoan, setSelectedLoan] = useState<Loan>({...baseLoan});
    const router = useRouter();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isOpenDebt, onOpen: onOpenDebt, onOpenChange: onOpenDebtChange} = useDisclosure();
    const {isOpen: isOpenLoan, onOpen: onOpenLoan, onOpenChange: onOpenLoanChange} = useDisclosure();

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

    const onSelectPatrimony = (patrimony: Patrimony) => {
        setSelectedPatrimony(patrimony);
        onOpen()
    }

    const onSelectDebt = (debt: Debts) => {
        setSelectedDebt(debt);
        onOpenDebt();
    }

    const onSelectLoan = (loan: Loan) => {
        setSelectedLoan(loan);
        onOpenLoan();
    }

    const getBalance = () => {
        return (totalSavings + totalPatrimonies + totalLoans) - totalDebts;
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
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1">
                            <Kpi 
                                title="Balance" 
                                color="text-blue-500"
                                value={getBalance()}
                            />
                            <Kpi 
                                title="Ahorros" 
                                value={totalSavings} 
                                color="text-green-500"
                                isPressable
                                onPress={() => router.push(FINANCE_ROUTES.SAVINGS.path)}
                            />
                            <Kpi 
                                title="Deudas" 
                                value={totalDebts}
                                color="text-red-500" 
                            />
                            <Kpi 
                                title="Patrimonio"
                                value={totalPatrimonies} 
                                color="text-green-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 mt-6">
                            <FinancialOverview />
                        </div>
                        <Divider className="my-6" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-light">Deudas</h3>
                                    <Button className="hover:cursor-pointer" variant="light">
                                        <FaPlus></FaPlus> Agregar
                                    </Button>
                                </div>
                                <DebtsList onSelectDebt={(debt) => onSelectDebt(debt)} />
                                <DebtManagerModal isOpen={isOpenDebt} onOpenChange={onOpenDebtChange} debt={selectedDebt}/>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-light">Patrimonio</h3>
                                    <Button className="hover:cursor-pointer" variant="light">
                                        <FaPlus></FaPlus> Agregar
                                    </Button>
                                </div>
                                <PatrimonyList onSelectPatrimony={(patrimony) => onSelectPatrimony(patrimony)} />
                                <PatrimonyManagerModal isOpen={isOpen} onOpenChange={onOpenChange} patrimony={selectedPatrimony}/>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-light">Prestamos</h3>
                                    <Button className="hover:cursor-pointer" variant="light" onClick={() => onSelectLoan({...baseLoan})}>
                                        <FaPlus></FaPlus> Agregar
                                    </Button>
                                </div>
                                <LoanList onSelectLoan={(loan) => onSelectLoan(loan)} />
                                <LoansManagerModal isOpen={isOpenLoan} onOpenChange={onOpenLoanChange} loan={selectedLoan}/>
                            </div>
                        </div>
                        <Divider className="my-6" />
                        <Feedback patrimonies={totalPatrimonies} savings={totalSavings + totalLoans} debts={totalDebts} />
                        <Divider className="my-6" />
                    </div>
            }
        </>
    )
}