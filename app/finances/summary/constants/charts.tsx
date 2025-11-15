import { formatCurrency } from "@/app/lib/currency"
import { ApexOptions } from "apexcharts"

export const getAreaChartOptionsMonthly = (months: string[]): ApexOptions => {

    return {
        chart: {
            type: "bar",
            height: 400,
            toolbar: {
                show: true,
            },
            fontFamily: "inherit",
        },
        xaxis: {
            categories: months,
        },
        yaxis: {
            title: {
                text: "Valor en pesos",
            },
            labels: {
                formatter: (value: number) => formatCurrency(value),
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `${formatCurrency(value)}`,
            },
        },
        colors: ["#22c55e", "#ef4444", "#3b82f6"],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
        },
        theme: {
            mode: "light",
        },
    }
}

export const getBarChartOptionsSavings = (months: string[]): ApexOptions => {
    return {
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "60%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: months,
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `${value}%`,
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `${value}%`,
            },
        },
        colors: ["#8b5cf6"],
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
        },
        theme: {
            mode: "light",
        },
    }
}

export const getAreaChartOptionsMonthlyCategory = (months: string[]): ApexOptions => {

    return {
        chart: {
            type: "line",
            height: 500,
            toolbar: {
                show: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        xaxis: {
            categories: months,
        },
        yaxis: {
            title: {
                text: "Valor en pesos",
            },
            labels: {
                formatter: (value: number) => formatCurrency(value),
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `${formatCurrency(value)}`,
            },
        },
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
        },
    }
}