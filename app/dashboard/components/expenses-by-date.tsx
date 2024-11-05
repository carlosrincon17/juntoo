'use client';

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByDate } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";

export default function ExpensesByDate(props: {
    expensesFilter: ExpensesFilters
}) {
    const { expensesFilter } = props;
    const [expensesByDate, setExpensesByDate] = useState<ExpenseByDate[]>([]);

    const chartId = 'expenses-by-date-chart';

    async function getExpensesByDateData(){
        const expensesByDateData = await getExpensesByDate(expensesFilter);
        setExpensesByDate(expensesByDateData);
    }

    useEffect(() => {
        if(expensesFilter.startDate && expensesFilter.endDate){
            getExpensesByDateData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    useEffect(() => {
        if(
            expensesByDate.length > 0
        ) {
            if(Chart.getChart(chartId)) {
                Chart.getChart(chartId)?.destroy()
            }
            const ctx = document.getElementById(chartId) as HTMLCanvasElement;
            const parents = [...new Set(expensesByDate.map(item => item.parent))];
            const dates = [...new Set(expensesByDate.map(item => item.date))];
            const datasets = parents.map(parent => {
                return {
                    label: parent,
                    data: dates.map(date => {
                        const entry = expensesByDate.find(d => d.parent === parent && d.date === date);
                        return entry ? entry.totalExpenses : 0;
                    }),
                    fill: false
                };
            });

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: datasets,
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            offset: true,
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value) => {
                                return `$${formatCurrency(value)}`;
                            },
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 16
                            },
                            display: false
                        },
                        
                    },
                    responsive: true,
                },
            });
        }
    }, [expensesByDate]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4"> Cuando lo estas gastando? </h3>
                <canvas id="expenses-by-date-chart"></canvas>
            </CardBody>
        </Card>
    )
}