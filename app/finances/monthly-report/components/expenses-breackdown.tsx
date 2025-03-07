'use client'

import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
    chart: {
        type: "pie",
    },
    theme: {
        palette: "palette2",
    },
    legend: {
        show: true,
        position: "top",
    },
    tooltip: {
        y: {
            formatter: (val: number) => formatCurrency(val),
        },
    },
};

export const ExpensesBreakdown = (props: { totalExpenses: number, expensesFilter: ExpensesFilters, transactionType: TransactionType }) => {
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
                    <div>
                        <div id="chart">
                            <Chart options={options} series={series} type="pie" />
                        </div>
                        <div id="html-dist"></div>
                    </div>
                </>
            }
        </div>
    )
}