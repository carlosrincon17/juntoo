'use client';

import { Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByDate } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ExpensesByDate({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [expensesByDate, setExpensesByDate] = useState<ExpenseByDate[]>([]);
    const [loading, setLoading] = useState(true);

    async function getExpensesByDateData() {
        setLoading(true);
        const expensesByDateData = await getExpensesByDate(expensesFilter);
        setExpensesByDate(expensesByDateData);
        setLoading(false);
    }

    useEffect(() => {
        if (expensesFilter.startDate && expensesFilter.endDate) {
            getExpensesByDateData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    const chartOptions: ApexOptions  = {
        chart: {
            type: "line",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        xaxis: {
            categories: expensesByDate.map((item) => item.date),
        },
        yaxis: {
            title: {
                text: "Valor en pesos",
            },
            labels: {
                formatter: (value: number) => formatCurrency(value),
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: (value: number) => formatCurrency(value),
            },
        },
    };

    const chartSeries = [
        {
            name: "Gastos",
            data: expensesByDate.map((item) => item.totalExpenses),
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center">
            {!loading ? (
                <Card className="w-full h-full shadow-md max-w-7xl">
                    <CardBody className="p-4">
                        <h3 className="text-xl font-light mb-4">Gastos por día</h3>
                        <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
                    </CardBody>
                </Card>
            ) : (
                <Card>
                    <CardBody className="p-4">
                        <div className="flex justify-center items-center">
                            <CustomLoading className="mt-24" />
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
