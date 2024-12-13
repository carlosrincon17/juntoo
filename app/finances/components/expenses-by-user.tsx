'use client';

import { Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { UserExpense } from "@/app/types/expense";
import { getExpensesByUser } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ExpenseByUserChart({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [expensesByUser, setExpensesByUser] = useState<UserExpense[]>([]);
    const [loading, setLoading] = useState(true);

    async function getExpensesByUserData() {
        setLoading(true);
        const expensesByUserData = await getExpensesByUser(expensesFilter);
        setExpensesByUser(expensesByUserData);
        setLoading(false);
    }

    useEffect(() => {
        if (expensesFilter.startDate && expensesFilter.endDate) {
            getExpensesByUserData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    const chartOptions: ApexOptions  = {
        chart: {
            type: "donut",
        },
        theme: {
            palette: "palette2",
        },
        labels: expensesByUser.map((expense) => expense.userName),
        legend: {
            show: true,
            position: "top",
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => formatCurrency(val),
        },
        tooltip: {
            y: {
                formatter: (val: number) => formatCurrency(val),
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            formatter: (name: string) => `Total de ${name}`,
                        },
                        value: {
                            formatter: (val: string) => formatCurrency(parseInt(val)),
                        },
                    },
                },
            },
        },
    };

    const chartSeries = expensesByUser.map((expense) => expense.totalExpenses);

    return (
        <>
            {!loading ? (
                <Card>
                    <CardBody className="p-4">
                        <h3 className="text-xl font-light mb-4">Gastos por persona</h3>
                        <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
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
