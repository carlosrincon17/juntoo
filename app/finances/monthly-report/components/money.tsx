import { formatCurrency } from "@/app/lib/currency";
import { Tooltip } from "@nextui-org/react";

const formatNumber = (num: number) => {
    return (num / 1_000_000).toFixed(1) + "M";
};

export default function NumberWithTooltip(props: { value: number }) {
    const { value } = props;
    return (
        <Tooltip content={formatCurrency(value)}>
            <span className="text-lg font-semibold cursor-pointer">{formatNumber(value)}</span>
        </Tooltip>
    );
};