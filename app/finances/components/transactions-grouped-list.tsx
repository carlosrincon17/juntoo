import { Card, CardBody, Chip, useDisclosure } from "@heroui/react";
import { GroupedCategoryExpense } from "@/app/types/expense";
import { formatCurrency } from "@/app/lib/currency";
import { FaLayerGroup } from "react-icons/fa";
import { ExpensesFilters } from "@/app/types/filters";
import { useState } from "react";
import CategoryHistoryDrawer from "./category-history-drawer";

interface TransactionsGroupedListProps {
    data: GroupedCategoryExpense[];
    filters: ExpensesFilters;
}

export default function TransactionsGroupedList({ data, filters }: TransactionsGroupedListProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        onOpen();
    }

    if (data.length === 0) {
        return (
            <Card className="shadow-md">
                <CardBody className="py-10 text-center text-gray-500">
                    No se encontraron transacciones para agrupar.
                </CardBody>
            </Card>
        );
    }

    return (
        <>
            <Card className="shadow-md flex flex-col gap-4">
                <CardBody className="space-y-2 relative mt-3">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white to-[#f9faff] border border-[#f0f4ff] hover:shadow-md hover:border-[#e4e9ff] transition-all duration-200 cursor-pointer"
                            onClick={() => handleCategoryClick(item.categoryName)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm">
                                    <FaLayerGroup className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="text-sm font-medium text-[#121432]">{item.categoryName}</h5>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-light text-[#121432]/60">{item.count} movimientos</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-base font-medium text-[#121432]">
                                    {formatCurrency(item.total)}
                                </span>
                                <Chip size="sm" variant="flat" className="bg-[#121432]/5 text-[#121432]/70 text-[10px] h-5 px-1">
                                    {item.parentCategory}
                                </Chip>
                            </div>
                        </div>
                    ))}
                </CardBody>
            </Card>
            {selectedCategory && (
                <CategoryHistoryDrawer
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    categoryName={selectedCategory}
                    filters={filters}
                />
            )}
        </>
    );
}
