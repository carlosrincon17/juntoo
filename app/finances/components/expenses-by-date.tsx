'use client';

import { Card, CardBody } from "@heroui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByDate } from "@/app/actions/expenses";
import { formatCurrency, formatToShortCurrency } from "@/app/lib/currency";
import { ApexOptions } from "apexcharts";
import { GraphEskeleton } from "@/app/components/graph-skeleton";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ExpensesByDate({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [expensesByDate, setExpensesByDate] = useState<ExpenseByDate[]>([]);
    const [loading, setLoading] = useState(true);

    async function getExpensesByDateData() {
        setLoading(true);
        const expensesByDateData = await getExpensesByDate(expensesFilter);

        // Calculate max days in the selected month
        const maxDay = new Date(expensesFilter.endDate).getDate();

        setExpensesByDate(fillMissingDays(maxDay, expensesByDateData));
        setLoading(false);
    }

    const fillMissingDays = (maxDay: number, data: ExpenseByDate[]): ExpenseByDate[] => {
        const dayMap = new Map(data.map(item => [item.date, item.totalExpenses]));
        return Array.from({ length: maxDay }, (_, i) => {
            const dayStr = (i + 1).toString();
            return {
                date: dayStr,
                totalExpenses: dayMap.get(dayStr) ?? 0,
            };
        });
    };

    useEffect(() => {
        if (expensesFilter.startDate && expensesFilter.endDate) {
            getExpensesByDateData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    const chartOptions: ApexOptions = {
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
            title: {
                text: "Dia del mes",
            }
        },
        yaxis: {
            labels: {
                formatter: (value: number) => formatToShortCurrency(value),
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
            color: '#2dd4bf'
        }
    ];

    if (loading) {
        return <GraphEskeleton />;
    }

    const hasData = expensesByDate.some(item => item.totalExpenses > 0);

    if (!hasData) {
        return null;
    }

    return (
        <Card className="w-full shadow-md bg-gradient-to-br from-white to-[#f9faff] p-4 col-span-1 md:col-span-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
            <h3 className="text-xl font-extralight mb-4">Gastos por día</h3>
            <CardBody>
                <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
            </CardBody>
        </Card>
    );
}
