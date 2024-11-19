'use client'

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function BalanceChart(props: {
    totalExpenses: number,
    totalIncomes: number,
}) {
    Chart.register(ChartDataLabels);
    const { totalExpenses, totalIncomes } = props;
    const chartId = "balance-chart";
    useEffect(() => {
        if(
            totalExpenses
            && totalIncomes
        ){
            if(Chart.getChart(chartId)) {
                Chart.getChart(chartId)?.destroy()
            }
            const ctx = document.getElementById(chartId) as HTMLCanvasElement;
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Disponible', 'Gastado'],
                    datasets: [{
                        label: 'Balance',
                        data: [totalIncomes - totalExpenses, totalExpenses],
                        backgroundColor: ['#36D399', '#FF6384'],
                        borderColor: ['#36D399', '#FF6384'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        datalabels: {
                            formatter: (value) => {
                                const total = totalIncomes;
                                const percentage = (value / total * 100).toFixed(1) + '%';
                                return percentage;
                            },
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 16
                            }
                        }
                    },
                    responsive: true,
                },
            });
        }
    }, [totalExpenses, totalIncomes]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4"> Ingresos vs Gastos</h3>
                <canvas id="balance-chart"></canvas>
            </CardBody>
        </Card>
    )
}