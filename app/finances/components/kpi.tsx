import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";

export default function Kpi(props: { 
    title: string, 
    value: number, 
    customClasses: string[], 
    isPressable?: boolean, 
    onPress?: () => void,
    icon?: JSX.Element 
}) {
    const { title, value, isPressable, onPress, icon } = props;
    return (
        <Card isPressable={isPressable} onPress={onPress} radius="none" shadow="sm">
            <CardBody className="p-4">
                <div className="flex flex-row justify-between">
                    <div className="w-11/12">
                        <div className="flex mb-2">
                            <h3 className="text-2xl font-extralight">{title}</h3>
                        </div>
                        <p className="text-2xl font-semibold">{formatCurrency(value)}</p>
                        <div className="flex items-center">
                        </div>
                    </div>
                    <div className="w-1/12">
                        {icon ? React.cloneElement(icon, { size: 'auto' }): null}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}