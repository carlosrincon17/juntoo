'use client';

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpensesFilters } from "@/app/types/filters";
import { UserExpense } from "@/app/types/expense";
import { getExpensesByUser } from "@/app/actions/expenses";

export default function ExpenseByUserChart(props: {
    expensesFilter: ExpensesFilters
}) {
    Chart.register(ChartDataLabels);
    const { expensesFilter } = props;
    const [expensesByUser, setExpensesByUser] = useState<UserExpense[]>([]);

    const chartId = 'expenses-by-user-chart';

    async function getExpensesByUserData(){
        const expensesByUserData = await getExpensesByUser(expensesFilter);
        setExpensesByUser(expensesByUserData);
    }

    useEffect(() => {
        if(expensesFilter.startDate && expensesFilter.endDate){
            getExpensesByUserData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    useEffect(() => {
        if(
            expensesByUser.length > 0
        ) {
            if(Chart.getChart(chartId)) {
                Chart.getChart(chartId)?.destroy()
            }
            const ctx = document.getElementById(chartId) as HTMLCanvasElement;
            const labels = expensesByUser.map(expense => expense.userName);
            const values = expensesByUser.map(expense => expense.totalExpenses);
            const totalExpenses = expensesByUser.reduce((acc, expense) => acc + expense.totalExpenses, 0);
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Gastos',
                        data: values,
                        backgroundColor: ['#36D399', '#FF6384'],
                        borderColor: ['#36D399', '#FF6384'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        datalabels: {
                            formatter: (value) => {
                                const total = totalExpenses;
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
    }, [expensesByUser]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4"> Quien los está gastando? </h3>
                <canvas id="expenses-by-user-chart"></canvas>
            </CardBody>
        </Card>
    )
}