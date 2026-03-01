'use client'

import { Savings } from "@/app/types/saving";
import { useEffect, useState } from "react";
import { getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import SummarySection from "./component/summary-section";
import { Patrimony } from "@/app/types/patrimony";
import { Debts } from "@/app/types/debts";
import { getPatrimonies } from "../summary/actions/patrimonies";
import { getDebts } from "../summary/actions/debts";
import SavingsList from "./component/savings-list";
import DebtsList from "./component/debts-list";
import { Card, Tab, Tabs } from "@heroui/react";
import PatrimoniesList from "./component/patrimonies-list";

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
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        savings: 0,
        assets: 0,
        debts: 0,
        balance: 0,
        loading: true,
    });


    const loadInitialData = async () => {
        setLoading(true);
        const [savingsData, patrimoniesData, debtsData] = await Promise.all([
            getSavings(),
            getPatrimonies(),
            getDebts(),
        ]);
        setSavings(savingsData);
        setPatrimonies(patrimoniesData);
        setDebts(debtsData);

        const savingsSum = savingsData.reduce((t, s) => t + (s.copValue ?? s.value), 0);
        const assetsSum = patrimoniesData.reduce((t, p) => t + p.value, 0);
        const debtsSum = debtsData.reduce((t, d) => t + d.value, 0);
        setSummaryData({
            savings: savingsSum,
            assets: assetsSum,
            debts: debtsSum,
            balance: savingsSum + assetsSum - debtsSum,
            loading: false,
        });
        setLoading(false);
    }

    useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <div>
            {
                loading ?
                    <CustomLoading /> :
                    <div className="flex flex-col gap-6 w-full">
                        <SummarySection
                            savings={summaryData.savings}
                            assets={summaryData.assets}
                            debts={summaryData.debts}
                            balance={summaryData.balance}
                            financialCounter={{
                                savings: savings.length,
                                assets: patrimonies.length,
                                debts: debts.length
                            }}
                        />
                        <Card className="p-4 shadow-md">
                            <Tabs
                                aria-label="Tabs colors"
                                radius="md"
                                variant="underlined"
                                size="md"
                                color="primary"
                                classNames={{
                                    base: "w-full",
                                    tabList: "w-full"
                                }}
                            >
                                <Tab key="savings" title="Ahorro">
                                    <SavingsList savings={savings} afterSaveSavings={loadInitialData} />
                                </Tab>
                                <Tab key="debts" title="Deudas">
                                    <DebtsList debts={debts} afterDebtsChange={loadInitialData} />
                                </Tab>
                                <Tab key="patrimonies" title="Patrimonio">
                                    <PatrimoniesList patrimonies={patrimonies} afterPatrimoniesChange={loadInitialData} />
                                </Tab>
                            </Tabs>
                        </Card>
                    </div>
            }
        </div>
    )
}