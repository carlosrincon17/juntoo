import { Chip } from "@nextui-org/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export const  VariationIndicator = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
    const isPositive = inverted ? value < 0 : value > 0
    const color = isPositive ? "success" : "danger"
    return (
        <Chip
            startContent={isPositive ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
            color={color}
            variant="flat"
            size="sm"
        >
            {Math.abs(value).toFixed(1)}%
        </Chip>
    )
}