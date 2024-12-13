'use client'

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ApexCharts from "apexcharts";
import { formatCurrency } from "@/app/lib/currency";

export default function BalanceChart(props: {
    totalExpenses: number,
    totalIncomes: number,
}) {
    Chart.register(ChartDataLabels);
    const { totalExpenses, totalIncomes } = props;

    useEffect(() => {
        if(
            totalExpenses
            && totalIncomes
        ){
            const options = {
                theme: {
                    palette: 'palette2'
                },
                series: [totalExpenses, totalIncomes - totalExpenses],
                labels: ["Gastado", "Disponible"],
                chart: {
                    type: 'pie'
                },
                legend: {
                    show: true,
                    position: 'top'
                },
                dataLabels: {
                    tooltip: {
                        enabled: true,
                        formatter: formatCurrency
                    }
                },
                tooltip: {
                    y: {
                        formatter: formatCurrency
                    }
                },
            }
            const chart = new ApexCharts(document.querySelector("#balance-chart"), options);
            chart.render();
        }
    }, [totalExpenses, totalIncomes]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4"> Ingresos vs Gastos</h3>
                <div id="balance-chart"></div>
            </CardBody>
        </Card>
    )
}