'use client';

import { Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/app/lib/currency";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BalanceChart({ totalExpenses, totalIncomes }: {
  totalExpenses: number;
  totalIncomes: number;
}) {
    const chartOptions: ApexOptions = {
        chart: {
            type: "pie",
        },
        theme: {
            palette: "palette2",
        },
        labels: ["Gastado", "Disponible"],
        legend: {
            show: true,
            position: "top",
        },
        dataLabels: {
            formatter: (val: number) => `${val.toFixed(2)} %`,
        },
        tooltip: {
            y: {
                formatter: (val: number) => formatCurrency(val),
            },
        },
    };

    const chartSeries = [
        totalExpenses,
        totalIncomes - totalExpenses,
    ];

    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4">Ingresos vs Gastos</h3>
                <Chart 
                    options={chartOptions} 
                    series={chartSeries} 
                    type="pie" 
                    height={350} 
                />
            </CardBody>
        </Card>
    );
}
