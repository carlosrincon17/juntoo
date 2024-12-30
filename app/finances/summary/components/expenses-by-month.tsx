'use client';

import { Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByMonth } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ExpensesByMonth() {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState([] as ApexAxisChartSeries)
    const [chartOptions, setChartOptions] = useState({} as ApexOptions)

    async function getExpensesByDateData() {
        const expensesByDateData = await getExpensesByMonth();
        const average = expensesByDateData.reduce((sum, value) => sum + value.totalExpenses, 0) / expensesByDateData.length;
        const averages = expensesByDateData.map(() => average)
        const newSeries: ApexAxisChartSeries = [
            {
                name: "Gastos",
                data: expensesByDateData.map((item) => item.totalExpenses),
            },
            {
                name: "Promedio",
                data:  averages,
            },
            {
                name: 'Presupuesto',
                data: expensesByDateData.map(() => 17000000)
            }
        ]
        setChartOptions(getChartOptions(expensesByDateData));
        setSeries(newSeries);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true)
        getExpensesByDateData()
    }, []);

    const getChartOptions = (expensesByDateData: ExpenseByDate[]): ApexOptions => {
        return {
            chart: {
                type: "bar",
                height: 450,
                zoom: {
                    enabled: false
                },
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
                curve: 'straight',
                width: [3, 3, 3],
                dashArray: [0, 5, 5]
            },
            xaxis: {
                tickPlacement: "between",
                categories: expensesByDateData.map((item) => item.date),
            },
            yaxis: {
                min: 10000000,
                title: {
                    text: "Valor en pesos",
                },
                labels: {
                    formatter: (value: number) => formatCurrency(value).split('.')[0] + " M",
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (value: number) => formatCurrency(value),
                },
            },}
    };

    return (
        <>
            {!loading ? (
                <Card className="h-full">
                    <CardBody className="p-4">
                        <h3 className="text-2xl font-extralight mb-4">Promedío (Últimos 6 meses)</h3>
                        <Chart options={chartOptions} series={series} type="line" height={350} />
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
