import { formatCurrency } from "@/app/lib/currency";
import { Card, CardBody } from "@nextui-org/react";

export default function Kpi(props: { title: string, value: number, customClasses: string[], isPressable?: boolean, onPress?: () => void }) {
    const { title, value, customClasses, isPressable, onPress  } = props;

    return (
        <Card className={["bg-gradient-to-br", ...customClasses].join(" ")} isPressable={isPressable} onPress={onPress}>
            <CardBody className="p-6">
                <div className="flex mb-4">
                    <h3 className="text-2xl font-extralight text-white">{title}</h3>
                </div>
                <p className="text-2xl font-semibold text-white mb-2">{formatCurrency(value)}</p>
                <div className="flex items-center text-white">
                </div>
            </CardBody>
        </Card>
    )
}