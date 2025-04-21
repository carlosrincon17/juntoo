"use client"

import { Button, useDisclosure } from "@heroui/react"
import { FaMinus, FaPlus } from "react-icons/fa"
import NewExpensePanel from "../categories/components/new-expense-modal";
import { useState } from "react";
import { TransactionType } from "@/utils/enums/transaction-type";


export default function FloatingManageButton () {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType>(TransactionType.Outcome);


    const onCreateExpenseClick = (transactionType: TransactionType) => {
        setSelectedTransactionType(transactionType);
        onOpen();
    }

    return (
        <>
            <NewExpensePanel isOpen={isOpen} onOpenChange={onOpenChange} transactionType={selectedTransactionType} />
            <div className="fixed bottom-6 right-6 z-20 opacity-100 space-x-2">
                <Button
                    className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg justify-center p-0 text-white "
                    onPress={() => onCreateExpenseClick(TransactionType.Income)}
                    isIconOnly
                >
                    <FaPlus className="h-4 w-4 block" />
                </Button>
                <Button
                    className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg justify-center p-0 text-white "
                    onPress={() => onCreateExpenseClick(TransactionType.Outcome)}
                    isIconOnly
                >
                    <FaMinus className="h-4 w-4 block " />
                </Button>
            </div>
        </>
    )
}

