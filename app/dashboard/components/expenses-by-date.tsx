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
            const labels = expensesByDate.map(expense => expense.date);
            const values = expensesByDate.map(expense => expense.totalExpenses);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Gastos',
                        data: values,
                        backgroundColor: '#36D399',
                        borderColor: '#36D399',
                    }],
                },
                options: {
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
                        }
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