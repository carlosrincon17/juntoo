'use client'

import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Card, CardHeader } from "@nextui-org/react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
    chart: {
        type: "pie",
    },
    theme: {
        palette: "palette2",
    },
    legend: {
        position: "bottom",
        fontFamily: "inherit",
    },
    plotOptions: {
        pie: {
            donut: {
                size: "70%",
                background: "transparent",
                labels: {
                    show: true,
                    name: {
                        show: true,
                         
                    },
                    value: {
                        show: true,
                        formatter: (value: string) => formatCurrency(Number(value)),
                    },
                    total: {
                        show: false,
                    },
                },
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    height: 300,
                },
                legend: {
                    position: "bottom",
                },
            },
        },
    ],
    tooltip: {
        enabled: false,
    },
    states: {
        active: {
            filter: {
                type: "none",
            },
        },  
    },
};

export const ExpensesBreakdown = (props: { totalExpenses: number, expensesFilter?: ExpensesFilters, transactionType: TransactionType }) => {
    const {  expensesFilter, transactionType } = props;

    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<number[]>([]);
    const [options, setOptions] = useState<ApexOptions>({...chartOptions})

    const getTransactionListData = async () => {
        const transactionsData = await getTopCategoriesWithMostExpenses(expensesFilter, transactionType);
        setSeries(transactionsData.map(item => item.totalExpenses));
        setOptions({...chartOptions, labels: transactionsData.map(item => item.categoryName)})
        setLoading(false);
    }

    useEffect(() => {
        getTransactionListData();
    }, [expensesFilter]);

    return (
        <div>
            {loading ?
                <CustomLoading /> :
                <>
                    <Card className="shadow-md p-2">
                        <CardHeader className="space-y-2 block">
                            <h1 className="text-xl font-extralight">Gastos por categoria</h1> 
                            <div className="flex flex-col">
                                <p className="text-xs text-default-500">
                                    Conoce siempre las categorías con las que más gastas en tus presupuestos.
                                </p>
                            </div>
                        </CardHeader>
                        <div id="chart">
                            <Chart options={options} series={series} type="donut" />
                        </div>
                        <div id="html-dist"></div>
                    </Card>
                </>
            }
        </div>
    )
}