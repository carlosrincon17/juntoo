'use client';

import { Card, CardBody } from "@heroui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByDate } from "@/app/actions/expenses";
import { formatCurrency, formatToShortCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ExpensesByDate({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [expensesByDate, setExpensesByDate] = useState<ExpenseByDate[]>([]);
    const [expensesByDatePrevious, setExpensesByDatePrevious] = useState<ExpenseByDate[]>([]);
    const [loading, setLoading] = useState(true);


    const getPreviousMonthDateRangeFilter = () => {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        return { startDate, endDate };
    };

    const getCurrentMonthDateRangeFilter = () => {
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { startDate, endDate };
    };


    async function getExpensesByDateData() {
        setLoading(true);
        const expensesByDateData = await getExpensesByDate(getCurrentMonthDateRangeFilter());
        const maxDay = Math.max(...expensesByDateData.map(item => parseInt(item.date, 10)));
        setExpensesByDate(fillMissingDays(Number(maxDay), expensesByDateData));
        const expensesByDatePreviousData = await getExpensesByDatePreviousData();
        setExpensesByDatePrevious(fillMissingDays(Number(maxDay), expensesByDatePreviousData));
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

    async function getExpensesByDatePreviousData() {
        const previousFilter = getPreviousMonthDateRangeFilter();
        return await getExpensesByDate(previousFilter);
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
        },
        {
            name: "Gastos mes anterior",
            data: expensesByDatePrevious.map((item) => item.totalExpenses),
            color: '#f97066',
            hidden: true
        },
    ];

    return (
        <>
            {!loading && expensesByDate.length  && expensesByDatePrevious.length ? (
                <Card className="w-full shadow-md bg-gradient-to-br from-white to-[#f9faff] p-4">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
                    <h3 className="text-xl font-extralight mb-4">Gastos por día</h3>
                    <CardBody>
                        <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
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
        </>
    );
}
