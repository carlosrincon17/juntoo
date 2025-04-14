'use client'

import { Savings } from "@/app/types/saving";
import {  useEffect, useState } from "react";
import { getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import SummarySection from "./component/summary-section";
import { Patrimony } from "@/app/types/patrimony";
import { Debts } from "@/app/types/debts";
import { getPatrimonies } from "../summary/actions/patrimonies";
import { getDebts } from "../summary/actions/debts";
import SavingsList from "./component/savings-list";
import DebtsList from "./component/debts-list";
import { Tab, Tabs } from "@heroui/react";
import PatrimoniesList from "./component/patrimonies-list";
import LoansList from "./component/loans-list";
import { Loan } from "@/app/types/loans";
import { getLoans } from "../summary/actions/loans";

type SummaryData = {
    savings: number,
    assets: number,
    debts: number,
    balance: number,
    loading: boolean,
}

export default function Page() {
    const [savings, setSavings] = useState<Savings[]>([]);
    const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
    const [debts, setDebts] = useState<Debts[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        savings: 0,
        assets: 0,
        debts: 0,
        balance: 0,
        loading: true,
    });


    const loadSummaryData = async () => {
        const savingsSum = savings.reduce((total, saving) => total + saving.value, 0);
        const assetsSum = patrimonies.reduce((total, saving) => total + saving.value, 0);
        const debtsSum = debts.reduce((total, saving) => total + saving.value, 0);
        const loansSum = loans.reduce((total, saving) => total + saving.value, 0);
        const balanceSum = savingsSum + assetsSum - debtsSum + loansSum;
        setSummaryData({
            savings: savingsSum,
            assets: assetsSum,
            debts: debtsSum,
            balance: balanceSum,
            loading: false,
        });
        setLoading(false);
    }

    const getSavingsData = async () => {
        const savingsData = await getSavings();
        setSavings(savingsData);
    }

    const getPatrimoniesData = async () => {
        const patrimoniesData = await getPatrimonies();
        setPatrimonies(patrimoniesData);
    }

    const getDebtsData = async () => {
        const debtsData = await getDebts();
        setDebts(debtsData);
    }

    const getLoansData = async () => {
        const loansData = await getLoans();
        setLoans(loansData);
    }

    const loadInitialData = async () => {
        setLoading(true);
        await getSavingsData();
        await getPatrimoniesData();
        await getDebtsData();
        await getLoansData();
        loadSummaryData();
    }

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if(debts.length > 0 && patrimonies.length > 0 && savings.length > 0 && loans.length > 0) {
            loadSummaryData();
        }
    }, [debts, patrimonies, savings, loans]);
    return (
        <div>
            {
                loading  ?
                    <CustomLoading /> :
                    <div>
                        <SummarySection savings={summaryData.savings} assets={summaryData.assets} debts={summaryData.debts} balance={summaryData.balance} />
                        <div className="mt-6 w-full">
                            <Tabs 
                                aria-label="Tabs colors" 
                                radius="full" 
                                size="sm" 
                                color="primary" 
                                classNames={{
                                    base: "w-full flex justify-end ",
                                }}
                            >
                                <Tab key="savings" title="Ahorro">
                                    <SavingsList savings={savings} afterSaveSavings={getSavingsData} />
                                </Tab>
                                <Tab key="debts" title="Deudas">
                                    <DebtsList debts={debts} afterDebtsChange={getDebtsData} />
                                </Tab>
                                <Tab key="patrimonies" title="Patrimonio">
                                    <PatrimoniesList patrimonies={patrimonies} afterPatrimoniesChange={getPatrimoniesData} />
                                </Tab>
                                <Tab key="loans" title="Prestamos">
                                    <LoansList loans={loans} afterLoansChange={getLoansData} />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
            }
        </div>
    )
}