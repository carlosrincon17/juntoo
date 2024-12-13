'use client'

import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody, Progress } from "@nextui-org/react";

const TOTAL_BUDGET = 17000000;

export const MonthlyBudget = (props: {
    totalExpenses: number,
}) => {
    const { totalExpenses } = props;
    const percentageUsed = (totalExpenses / TOTAL_BUDGET) * 100;
    const percentageAvailable = (TOTAL_BUDGET - totalExpenses) / TOTAL_BUDGET * 100;

    const getColorBudget = () => {
        if (percentageUsed > 80)
            return "text-red-700";
        if (percentageUsed > 50)
            return "text-orange-700";
        return "text-green-700";
    }

    const getGradient = () => {
        if (percentageUsed > 80)
            return "from-70% from-green-500 to-red-500";
        if (percentageUsed > 50)
            return "from-80% from-green-500 to-orange-500";
        return "from-green-400 to-blue-500";
    }

    return (
        <Card className="w-full">
            <CardBody className="w-full">
                <h3 className="text-2xl font-extralight mb-4">Presupuesto mensual</h3>
                <div className="grid mb-4 flex-row grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <p className="text-sm font-light">Total</p>
                        <p className="text-2xl font-bold">{formatCurrency(TOTAL_BUDGET)}</p>
                    </div>
                    <div className="md:text-right">
                        <p className="text-sm font-light">Disponible</p>
                        <p className={"text-2xl font-bold " + getColorBudget()}>{formatCurrency(TOTAL_BUDGET - totalExpenses)}</p>
                    </div>
                </div>
                <Progress 
                    aria-label="Budget progress" 
                    value={percentageUsed} 
                    className="h-5 w-full"
                    size="lg"
                    classNames={{
                        base: "w-full h-5",
                        track: "drop-shadow-md border border-default",
                        indicator: "bg-gradient-to-r " + getGradient() ,
                        label: "tracking-wider font-medium text-default-600",
                        value: "text-foreground/60",
                    }}
                />
                <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">{percentageUsed.toFixed(1)}% usado</p>
                    <p className="text-sm text-gray-500">{percentageAvailable.toFixed(1)}% disponible</p>
                </div>
            </CardBody>
        </Card>
    )
}