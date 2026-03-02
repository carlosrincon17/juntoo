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
                        <Card className="p-2 sm:p-4 shadow-sm border border-gray-100 bg-white rounded-2xl">
                            <Tabs
                                aria-label="Tabs colors"
                                radius="md"
                                variant="underlined"
                                size="md"
                                color="primary"
                                classNames={{
                                    base: "w-full mb-2",
                                    tabList: "w-full",
                                    tab: "font-medium text-gray-500",
                                    tabContent: "group-data-[selected=true]:text-blue-600"
                                }}
                            >
                                <Tab key="savings" title="Ahorro">
                                    <div className="pt-2">
                                        <SavingsList savings={savings} afterSaveSavings={loadInitialData} />
                                    </div>
                                </Tab>
                                <Tab key="debts" title="Deudas">
                                    <div className="pt-2">
                                        <DebtsList debts={debts} afterDebtsChange={loadInitialData} />
                                    </div>
                                </Tab>
                                <Tab key="patrimonies" title="Patrimonio">
                                    <div className="pt-2">
                                        <PatrimoniesList patrimonies={patrimonies} afterPatrimoniesChange={loadInitialData} />
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card>
                    </div>
            }
        </div>
    )
}