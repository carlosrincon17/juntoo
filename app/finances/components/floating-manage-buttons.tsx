"use client"

import { Button } from "@heroui/react"
import { FaMinus, FaPlus } from "react-icons/fa"

interface FloatingAddButtonProps {
  onNewIncomeClick: () => void,
  onNewOutcomeClick: () => void,
  label?: string
}

export default function FloatingManageButton (props: FloatingAddButtonProps) {
    const { onNewIncomeClick, onNewOutcomeClick } = props;
    return (
        <div className="fixed bottom-6 right-6 z-20 opacity-100 space-x-2">
            <Button
                className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg justify-center p-0 text-white "
                onClick={onNewIncomeClick}
                isIconOnly
            >
                <FaPlus className="h-4 w-4 block" />
            </Button>
            <Button
                className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg justify-center p-0 text-white "
                onClick={onNewOutcomeClick}
                isIconOnly
            >
                <FaMinus className="h-4 w-4 block " />
            </Button>
        </div>
    )
}

