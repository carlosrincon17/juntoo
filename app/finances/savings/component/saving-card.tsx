import { formatCurrency } from "@/app/lib/currency";
import { Savings } from "@/app/types/saving";
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { FaEllipsisV } from "react-icons/fa";

export default function SavingCard(props: { saving: Savings, onClickSavings: (saving: Savings) => void, onClickDeleteSaving: (saving: Savings) => void }) {
    const { saving, onClickDeleteSaving, onClickSavings } = props;

    const getInterestColor = (rate: number): string => {
        if (rate === 0) return "text-gray-500"
        if (rate < 2) return "text-blue-500"
        if (rate < 4) return "text-emerald-500"
        return "text-amber-500"
    }
    return (
        <Card className="shadow-none border-r-0">
            <CardBody className="p-0">
                <div className="flex flex-col sm:flex-row w-full">
                    <div
                        className={`sm:w-1 w-full h-1 sm:h-auto ${saving.isInvestment ? "bg-emerald-500" : "bg-gray-200"}`}
                    ></div>

                    <div className="p-4 w-full">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div>
                                    <h3 className="text-md font-medium">{saving.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-xl font-bold text-primary">{formatCurrency(saving.value)}</p>
                                        {saving.isInvestment && (
                                            <p className={`text-xs ${getInterestColor(saving.annualInterestRate || 0)}`}>
                                                <span className="ml-1 font-medium">({saving.annualInterestRate}%)</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <FaEllipsisV className="hover:cursor-pointer"></FaEllipsisV>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem onClick={() => onClickSavings(saving)}>
                                    Editar
                                        </DropdownItem>
                                        <DropdownItem onClick={() => onClickDeleteSaving(saving)} className="text-red-600">
                                    Eliminar
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}