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
    const ctx = document.getElementById('balance-chart') as HTMLCanvasElement;

    useEffect(() => {
        if(
            totalExpenses
            && totalIncomes
        ){
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
                <h3 className="text-2xl font-semibold mb-4"> Como se ven? </h3>
                <canvas id="balance-chart"></canvas>
            </CardBody>
        </Card>
    )
}