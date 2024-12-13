"use client";

import { Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { CategoryExpense } from "@/app/types/expense";
import { getIncomesByCategory } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function IncomeBreakdown({ expensesFilter }: { expensesFilter: ExpensesFilters }) {
    const [incomesByCategory, setIncomesByCategory] = useState<CategoryExpense[]>([]);

    async function getIncomesByCategoryData() {
        const incomesByCategoryData = await getIncomesByCategory(expensesFilter);
        setIncomesByCategory(incomesByCategoryData);
    }

    useEffect(() => {
        if (expensesFilter.startDate && expensesFilter.endDate) {
            getIncomesByCategoryData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    const chartOptions: ApexOptions  = {
        chart: {
            type: "donut",
        },
        theme: {
            palette: "palette2",
        },
        labels: incomesByCategory.map((income) => income.categoryName),
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

    const chartSeries = incomesByCategory.map((income) => income.totalExpenses);

    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4">Fuentes de Ingreso</h3>
                {incomesByCategory.length > 0 ? (
                    <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
                ) : (
                    <div className="flex justify-center items-center">Cargando...</div>
                )}
            </CardBody>
        </Card>
    );
}
