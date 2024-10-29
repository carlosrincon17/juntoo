'use client'

import { Listbox, ListboxItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ItemCounter } from "./item-counter";
import { formatCurrency } from "@/app/lib/currency";
import { FaCircle } from "react-icons/fa";
import { Debts } from "@/app/types/debts";
import { getDebts } from "../actions/debts";

export default function DebtsList(props: {
    onSelectDebt: (debt: Debts) => void
}) {

    const { onSelectDebt } = props;
    const [debts, setDebts] = useState<Debts[]>([]);

    const getDebtsData = async () => {
        const debtsData = await getDebts();
        setDebts(debtsData);
    }

    useEffect(() => {
        getDebtsData();
    }, []);

    return (
        <div className="full-width">
            <Listbox
                className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium"
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                }}
            >
                {debts.map((debt) => (
                    <ListboxItem key={debt.id} value={debt.id}
                        startContent={<FaCircle className="text-red-500" />}
                        endContent={<ItemCounter value={formatCurrency(debt.value)} />}
                        onClick={() => onSelectDebt(debt)}
                    >
                        {debt.name}
                    </ListboxItem>
                ))}
            </Listbox>
        </div>
    )
}