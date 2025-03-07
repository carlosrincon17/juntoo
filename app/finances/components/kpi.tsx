import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import NumberWithTooltip from "./money";

export default function Kpi(props: { 
    title: string, 
    value: number, 
    isPressable?: boolean, 
    onPress?: () => void,
    color?: string, 
    type?: string,
    shorted?: boolean
}) {
    const { title, value, isPressable, onPress, color, type = 'currency', shorted } = props;

    const getValues = () => {
        if (type === 'percentage') {
            return `${value.toFixed(2)}%`;
        }
        return shorted ? (
            <NumberWithTooltip value={value} />
        ): formatCurrency(value);
    }
    return (
        <Card isPressable={isPressable} onPress={onPress} className="shadow-md">
            <CardBody className="px-4">
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className={`text-2xl font-light ${color}`}>{getValues()}</p>
                </div>
            </CardBody>
        </Card>
    )
}
