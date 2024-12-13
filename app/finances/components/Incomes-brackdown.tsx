'use client';

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpensesFilters } from "@/app/types/filters";
import { CategoryExpense } from "@/app/types/expense";
import { getIncomesByCategory } from "@/app/actions/expenses";
import { formatCurrency } from "@/app/lib/currency";
import ApexCharts from "apexcharts";

export default function IncomeBreakdown(props: {
    expensesFilter: ExpensesFilters
}) {
    Chart.register(ChartDataLabels);
    const { expensesFilter } = props;
    const [incomesByCategory, setIncomesByCategory] = useState<CategoryExpense[]>([]);

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
            const labels = incomesByCategory.map(expense => expense.categoryName);
            const values = incomesByCategory.map(expense => expense.totalExpenses);
            const options = {
                theme: {
                    palette: 'palette2'
                },
                series: values,
                labels: labels,
                chart: {
                    type: 'donut'
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
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                name: {
                                    formatter: (name: string) => `Total de ${name}`
                                },
                                value: {
                                    formatter: formatCurrency
                                }
                            }
                        }
                    }
                }
            }
            const chart = new ApexCharts(document.querySelector("#incomes-by-category-chart"), options);
            chart.render();
        }
    }, [incomesByCategory]);
    
    return (
        <Card>
            <CardBody className="p-4">
                <h3 className="text-xl font-light mb-4">Fuentes de Ingreso</h3>
                <div id="incomes-by-category-chart"></div>
            </CardBody>
        </Card>
    )
}