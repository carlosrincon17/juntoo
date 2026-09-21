import { formatCurrency } from "@/app/lib/currency"
import { ApexOptions } from "apexcharts"

const sharedChartOptions: ApexOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        fontFamily: "inherit",
        zoom: {
            enabled: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
    },
    tooltip: {
        y: {
            formatter: (value: number) => formatCurrency(value),
        },
    },
    yaxis: {
        labels: {
            formatter: (value: number) => formatCurrency(value),
        },
    },
    theme: {
        mode: "light",
    },
}

export const getNetWorthChartOptions = (labels: string[]): ApexOptions => {
    return {
        ...sharedChartOptions,
        chart: {
            ...sharedChartOptions.chart,
            type: "area",
            height: 340,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        colors: ["#6366f1"],
        markers: {
            size: 5,
            strokeWidth: 2,
            hover: {
                size: 7,
            },
        },
        xaxis: {
            categories: labels,
        },
    }
}

export const getSectionsChartOptions = (labels: string[]): ApexOptions => {
    return {
        ...sharedChartOptions,
        chart: {
            ...sharedChartOptions.chart,
            type: "line",
            height: 340,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        colors: ["#3b82f6", "#10b981", "#f43f5e"],
        markers: {
            size: 4,
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
        xaxis: {
            categories: labels,
        },
    }
}
