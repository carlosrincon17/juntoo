'use client'

import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Button, ButtonGroup, Card, CardBody, CardHeader } from "@heroui/react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
    chart: {
        type: "pie",
    },
    theme: {
        palette: "palette2",
    },
    legend: {
        position: "right",
        fontFamily: "inherit",
        fontWeight: '200',
    },
    plotOptions: {
        pie: {
            donut: {
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
        enabled: true,
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

export const ExpensesBreakdown = (props: { totalExpenses: number, expensesFilter?: ExpensesFilters}) => {
    const {  expensesFilter } = props;

    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<number[]>([]);
    const [options, setOptions] = useState<ApexOptions>({...chartOptions})
    const [transactionTypeSelected, setTransactionTypeSelected] = useState<TransactionType>(TransactionType.Outcome);

    const getTransactionListData = async () => {
        const transactionsData = await getTopCategoriesWithMostExpenses(expensesFilter, transactionTypeSelected);
        setSeries(transactionsData.map(item => item.totalExpenses));
        setOptions({...chartOptions, labels: transactionsData.map(item => item.categoryName)})
        setLoading(false);
    }

    const getColorByTransactionType = (transactionType: TransactionType) => {
        return transactionType === transactionTypeSelected ? 'primary' : 'default';
    }


    useEffect(() => {
        getTransactionListData();
    }, [expensesFilter, transactionTypeSelected]);

    return (
        <div>
            {loading?
                <Card className="shadow-md p-2 bg-gradient-to-br from-white to-[#f9faff] h-full">
                    <CardBody className="p-4">
                        <div className="flex justify-center items-center h-full">
                            <CustomLoading className="mt-24" />
                        </div>
                    </CardBody>
                </Card> :
                <>
                    <Card className="shadow-md p-2 bg-gradient-to-br from-white to-[#f9faff]">
                        <CardHeader className="space-y-2 flex items-center justify-between content-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
                            <h2 className="text-xl font-extralight">Movimientos por categoría </h2>
                            <ButtonGroup variant="flat" size="sm">
                                <Button 
                                    color={getColorByTransactionType(TransactionType.Outcome)} 
                                    onPress={() => setTransactionTypeSelected(TransactionType.Outcome)}
                                >
                                    Gastos
                                </Button>
                                <Button 
                                    color={getColorByTransactionType(TransactionType.Income)}
                                    onPress={() => setTransactionTypeSelected(TransactionType.Income)}
                                >
                                    Ingresos
                                </Button>
                            </ButtonGroup>
                        </CardHeader>
                        <div id="chart">
                            <Chart options={options} series={series} type="donut" />
                        </div>
                    </Card>
                </>
            }
        </div>
    )
}