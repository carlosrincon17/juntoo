'use client'

import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TOTAL_BUDGET = 17000000;

export const MonthlyBudget = (props: {
    totalExpenses: number,
}) => {
    const { totalExpenses } = props;

    const chartOptions: ApexOptions = {
        chart: {
            type: "donut",
        },
        theme: {
            palette: "palette2",
        },
        colors: ["#E74C3C", "#27AE60"],
        labels: ["Gastado", "Disponible"],
        legend: {
            show: true,
            position: "top",
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(2)} %`,
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
                            formatter: (name: string) => `Total ${name}`,
                        },
                        value: {
                            formatter: (val: string) => formatCurrency(parseInt(val)),
                        },
                    },
                },
            },
        },
    };
    
    const chartSeries = [
        totalExpenses,
        TOTAL_BUDGET - totalExpenses,
    ];
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4">Presupuesto <span className="text-medium font-extralight text-gray-500">(Total: {formatCurrency(TOTAL_BUDGET)})</span></h3>
                <Chart 
                    options={chartOptions} 
                    series={chartSeries} 
                    type="donut" 
                    height={350} 
                />
            </CardBody>
        </Card>
    );
}