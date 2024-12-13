'use client';

import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ExpensesFilters } from "@/app/types/filters";
import { ExpenseByDate } from "@/app/types/expense";
import { getExpensesByDate } from "@/app/actions/expenses";
import ApexCharts from "apexcharts";
import { formatCurrency } from "@/app/lib/currency";
import { CustomLoading } from "@/app/components/customLoading";

export default function ExpensesByDate(props: {
    expensesFilter: ExpensesFilters
}) {
    const { expensesFilter } = props;
    const [expensesByDate, setExpensesByDate] = useState<ExpenseByDate[]>([]);
    const [loading, setLoading] = useState(true);

    async function getExpensesByDateData(){
        setLoading(true);
        const expensesByDateData = await getExpensesByDate(expensesFilter);
        setLoading(false);
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
            const datasets = [...new Set(expensesByDate.map(item => item.totalExpenses))];
            const dates = [...new Set(expensesByDate.map(item => item.date))];
            const options = {
                series: [{
                    name: 'Gastos',
                    data: datasets
                }],
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        borderRadius: 5,
                        borderRadiusApplication: 'end'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: dates,
                },
                yaxis: {
                    title: {
                        text: 'Valor en pesos'
                    },
                    labels: {
                        formatter: function (value: string) {
                            return formatCurrency(parseInt(value))
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (value: string) {
                            return formatCurrency(parseInt(value))
                        }
                    }
                }
            };
            const chart = new ApexCharts(document.querySelector("#expenses-by-date-chart"), options);
            chart.render();
        }
    }, [expensesByDate]);
    
    return (
        <>
            {!loading ?
                <Card className="h-full">
                    <CardBody className="p-4">
                        <h3 className="text-xl font-light mb-4"> Gastos por día</h3>
                        <div id="expenses-by-date-chart"></div>
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