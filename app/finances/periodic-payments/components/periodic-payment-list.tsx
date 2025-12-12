"use client"

import { PeriodicPayment } from "@/app/types/periodic-payment"
import { Card, CardBody, Chip, Button, useDisclosure } from "@heroui/react"
import { FaTrash, FaHistory } from "react-icons/fa"
import { deletePeriodicPayment } from "@/app/actions/periodic-payments"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/app/components/confirmModal"
import { useState } from "react"
import PaymentHistoryDrawer from "./payment-history-drawer"

const frequencyLabels: Record<string, string> = {
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual",
    yearly: "Anual"
}

const colors: Record<string, string> = {
    indigo: "border-l-4 border-indigo-500",
    fuchsia: "border-l-4 border-fuchsia-500",
    emerald: "border-l-4 border-emerald-500",
    amber: "border-l-4 border-amber-500",
    sky: "border-l-4 border-sky-500",
    rose: "border-l-4 border-rose-500",
    cyan: "border-l-4 border-cyan-500",
    violet: "border-l-4 border-violet-500",
    green: "border-l-4 border-green-500",
    blue: "border-l-4 border-blue-500",
    stone: "border-l-4 border-stone-500",
    pink: "border-l-4 border-pink-500",
    lime: "border-l-4 border-lime-500",
    teal: "border-l-4 border-teal-500",
}

export default function PeriodicPaymentList({ payments }: { payments: PeriodicPayment[] }) {
    const router = useRouter()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onOpenChange: onHistoryOpenChange } = useDisclosure();

    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
    const [historyPaymentId, setHistoryPaymentId] = useState<number | null>(null);
    const [historyPaymentName, setHistoryPaymentName] = useState<string>("");

    const handleDeleteClick = (id: number) => {
        setSelectedPaymentId(id);
        onDeleteOpen();
    }

    const handleHistoryClick = (id: number, name: string) => {
        setHistoryPaymentId(id);
        setHistoryPaymentName(name);
        onHistoryOpen();
    }

    const onConfirmDelete = async (onClose: () => void) => {
        if (selectedPaymentId) {
            await deletePeriodicPayment(selectedPaymentId);
            router.refresh();
            onClose();
            setSelectedPaymentId(null);
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay pagos periódicos registrados.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {payments.map((payment) => (
                <Card key={payment.id} className={`w-full ${payment.category?.color ? colors[payment.category.color] : ''}`}>
                    <CardBody className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{payment.category?.name || "Sin categoría"}</span>
                                <Chip size="sm" variant="flat" color="primary">
                                    {frequencyLabels[payment.frequency]}
                                </Chip>
                            </div>
                            <span className="text-2xl font-bold">{formatCurrency(payment.value)}</span>
                            <span className="text-xs text-gray-400">
                                Inicia: {new Date(payment.startDate).toLocaleDateString()}
                            </span>
                            {payment.lastApplied && (
                                <span className="text-xs text-green-600 font-medium">
                                    Último pago: {new Date(payment.lastApplied).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button isIconOnly color="primary" variant="light" onPress={() => payment.id && handleHistoryClick(payment.id, payment.name)}>
                                <FaHistory />
                            </Button>
                            <Button isIconOnly color="danger" variant="light" onPress={() => payment.id && handleDeleteClick(payment.id)}>
                                <FaTrash />
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ))}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                title="Eliminar pago periódico"
                message="¿Estás seguro de eliminar este pago periódico? Esta acción no se puede deshacer."
                onConfirm={onConfirmDelete}
            />
            {historyPaymentId && (
                <PaymentHistoryDrawer
                    isOpen={isHistoryOpen}
                    onOpenChange={onHistoryOpenChange}
                    periodicPaymentId={historyPaymentId}
                    paymentName={historyPaymentName}
                />
            )}
        </div>
    )
}
