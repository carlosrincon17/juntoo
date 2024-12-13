'use client';

import { Card, CardBody } from "@nextui-org/react";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpensesFilters } from "@/app/types/filters";
import { UserExpense } from "@/app/types/expense";
import { getExpensesByUser } from "@/app/actions/expenses";
import ApexCharts from "apexcharts";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";

export default function ExpenseByUserChart(props: {
    expensesFilter: ExpensesFilters
}) {
    Chart.register(ChartDataLabels);
    const { expensesFilter } = props;
    const [expensesByUser, setExpensesByUser] = useState<UserExpense[]>([]);
    const [loading, setLoading] = useState(true);


    async function getExpensesByUserData(){
        setLoading(true);
        const expensesByUserData = await getExpensesByUser(expensesFilter);
        setLoading(false);
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
            const labels = expensesByUser.map(expense => expense.userName);
            const values = expensesByUser.map(expense => expense.totalExpenses);
            const options = {
                theme: {
                    palette: 'palette2' // upto palette10
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
            const chart = new ApexCharts(document.querySelector("#expenses-by-user-chart"), options);
            chart.render();
        }
    }, [expensesByUser]);
    
    return (
        <>
            {!loading ?
                <Card>
                    <CardBody className="p-4">
                        <h3 className="text-xl font-light mb-4">Gastos por persona </h3>
                        <div id="expenses-by-user-chart"></div>
                    </CardBody>
                </Card>
                :
                <Card>
                    <CardBody className="p-4">
                        <div className="flex justify-center items-center">
                            <CustomLoading className="mt-24" />
                        </div>
                    </CardBody>
                </Card>
            }
        </>
    )
}