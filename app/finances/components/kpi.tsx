import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody, Divider } from "@nextui-org/react";
import React from "react";

export default function Kpi(props: { 
    title: string, 
    value: number, 
    isPressable?: boolean, 
    onPress?: () => void,
    color?: string 
    type?: string
}) {
    const { title, value, isPressable, onPress, color, type = 'currency' } = props;

    const getValues = () => {
        if (type === 'percentage') {
            return `${value.toFixed(2)}%`;
        }
        return formatCurrency(value);
    }
    return (
        <Card className="shadow-none" isPressable={isPressable} onPress={onPress}>
            <CardBody className="py-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-default-500 font-light">{title}</p>
                    <Divider className="my-2" />
                    <p className={`text-2xl ${color}`}>{getValues()}</p>
                </div>
            </CardBody>
        </Card>
    )
}
