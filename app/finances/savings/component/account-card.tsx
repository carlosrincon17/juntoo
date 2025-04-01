"use client"

import { formatCurrency } from "@/app/lib/currency"
import { Button, Card } from "@heroui/react"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"

interface AccountCardProps {
  name: string
  value: number
  onEdit: () => void
  onDelete: () => void
  gradient: string
  textColor: string
  owner?: string
}

export default function AccountCard({
    name,
    value,
    onEdit,
    onDelete,
    gradient,
    textColor,
    owner
}: AccountCardProps) {

    return (
        <Card className={`overflow-hidden border-none shadow-md rounded-2xl bg-gradient-to-br ${gradient} h-full`}>
            <div className="p-6 relative h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className={`font-light text-sm ${textColor}/90`}>{name}</h3>
                        <p className={`text-2xl font-extralight mt-1 ${textColor}`}>{formatCurrency(value)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full bg-white/10 flex items-center gap-1 ${textColor}`}>
                        <span className="text-xs font-light">{owner}</span>
                    </div>
                </div>

                <div className="flex justify-end mt-auto gap-2 relative z-10">
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className={`h-8 w-8 rounded-full bg-white/20 hover:bg-white/30`}
                        onPress={onEdit}
                    >
                        <FaPencilAlt className="h-4 w-4 text-white" />
                    </Button>
                    <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className={`h-8 w-8 rounded-full bg-white/20 hover:bg-white/30`}
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

