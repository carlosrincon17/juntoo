"use client"

import { PeriodicPayment } from "@/app/types/periodic-payment"
import { Button, useDisclosure } from "@heroui/react"
import { FaPlus } from "react-icons/fa"
import PeriodicPaymentList from "./periodic-payment-list"
import NewPeriodicPaymentPanel from "./new-periodic-payment-modal"

export default function PeriodicPaymentsView({ payments }: { payments: PeriodicPayment[] }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Pagos Periódicos</h1>
                <Button color="primary" endContent={<FaPlus />} onPress={onOpen}>
                    Nuevo Pago
                </Button>
            </div>

            <PeriodicPaymentList payments={payments} />

            <NewPeriodicPaymentPanel isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    )
}
