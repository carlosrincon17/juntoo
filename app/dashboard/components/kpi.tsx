import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@nextui-org/react";

export default function Kpi(props: { title: string, value: number, customClasses: string[], isPressable?: boolean, onPress?: () => void }) {
    const { title, value, isPressable, onPress  } = props;

    return (
        <Card isPressable={isPressable} onPress={onPress} radius="none" shadow="sm">
            <CardBody className="p-4">
                <div className="flex mb-2">
                    <h3 className="text-2xl font-extralight">{title}</h3>
                </div>
                <p className="text-2xl font-semibold">{formatCurrency(value)}</p>
                <div className="flex items-center">
                </div>
            </CardBody>
        </Card>
    )
}