import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody, Divider } from "@nextui-org/react";
import React from "react";

export default function Kpi(props: { 
    title: string, 
    value: number, 
    isPressable?: boolean, 
    onPress?: () => void,
    color?: string 
}) {
    const { title, value, isPressable, onPress, color } = props;
    return (
        <Card className="shadow-sm" isPressable={isPressable} onPress={onPress}>
            <CardBody className="py-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-default-500">{title}</p>
                    <Divider className="my-2" />
                    <p className={`text-2xl font-semibold ${color}`}>{formatCurrency(value)}</p>
                </div>
            </CardBody>
        </Card>
    )
}
