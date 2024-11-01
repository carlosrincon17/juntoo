'use client';

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpensesFilters } from "@/app/types/filters";
import { CategoryExpense } from "@/app/types/expense";
import { getIncomesByCategory } from "@/app/actions/expenses";

export default function IncomeBreakdown(props: {
    expensesFilter: ExpensesFilters
}) {
    Chart.register(ChartDataLabels);
    const { expensesFilter } = props;
    const [incomesByCategory, setIncomesByCategory] = useState<CategoryExpense[]>([]);

    const chartId = 'incomes-by-category-chart';

    async function getIncomesByCategoryData(){
        const incomesByCategoryData = await getIncomesByCategory(expensesFilter);
        setIncomesByCategory(incomesByCategoryData);
    }

    useEffect(() => {
        if(expensesFilter.startDate && expensesFilter.endDate){
            getIncomesByCategoryData();
        }
    }, [expensesFilter.startDate, expensesFilter.endDate]);

    useEffect(() => {
        if(
            incomesByCategory.length > 0
        ) {
            if(Chart.getChart(chartId)) {
                Chart.getChart(chartId)?.destroy()
            }
            const ctx = document.getElementById(chartId) as HTMLCanvasElement;
            const labels = incomesByCategory.map(expense => expense.categoryName);
            const values = incomesByCategory.map(expense => expense.totalExpenses);
            const totalIncomes = incomesByCategory.reduce(
                (acc, expense) => +acc + +expense.totalExpenses, +0);
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Ingresos',
                        data: values,
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        datalabels: {
                            formatter: (value) => {
                                const percentage = (value / totalIncomes * 100).toFixed(1) + '%';
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
    }, [incomesByCategory]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4"> De donde vienen los ingresos? </h3>
                <canvas id="incomes-by-category-chart"></canvas>
            </CardBody>
        </Card>
    )
}