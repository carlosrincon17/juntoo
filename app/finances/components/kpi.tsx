import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@heroui/react";
import React from "react";

export default function Kpi(props: { 
    title: string, 
    value: number, 
    color?: string, 
    type?: string,
}) {
    const { title, value, color, type = 'currency' } = props;

    const getValues = () => {
        if (type === 'percentage') {
            return `${value.toFixed(2)}%`;
        }
        return formatCurrency(value);
    }
    return (
        <Card className="shadow-md">
            <CardBody className="px-4">
                <div className="flex flex-col">
                    <p className="text-md font-light">{title}</p>
                    <p className={`text-2xl font-light ${color}`}>{getValues()}</p>
                </div>
            </CardBody>
        </Card>
    )
}
