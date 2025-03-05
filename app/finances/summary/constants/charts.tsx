import { formatCurrency } from "@/app/lib/currency"
import { ApexOptions } from "apexcharts"

export const getAreaChartOptionsMonthly = (months: string[]): ApexOptions => {

    return {
        chart: {
            type: "area",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
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
                formatter: (value: number) => formatCurrency(value).split('.')[0] + " M",
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${value}`,
            },
        },
        colors: ["#22c55e", "#ef4444", "#3b82f6"],
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.1,
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
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