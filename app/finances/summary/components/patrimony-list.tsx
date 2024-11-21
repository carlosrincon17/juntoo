'use client'

import { Listbox, ListboxItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ItemCounter } from "./item-counter";
import { formatCurrency } from "@/app/lib/currency";
import { FaCircle } from "react-icons/fa";
import { getPatrimonies } from "../actions/patrimonies";
import { Patrimony } from "@/app/types/patrimony";

export default function PatrimonyList(props: {
    onSelectPatrimony: (patrimony: Patrimony) => void}
) {

    const { onSelectPatrimony } = props;
    const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);


    const getPatrimoniesData = async () => {
        const patrimoniesData = await getPatrimonies();
        setPatrimonies(patrimoniesData);
    }

    useEffect(() => {
        getPatrimoniesData();
    }, []);

    return (
        <div className="full-width">
            <Listbox
                className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium"
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                }}
            >
                {patrimonies.map((patrimony) => (
                    <ListboxItem key={patrimony.id} value={patrimony.id}
                        startContent={<FaCircle className="text-green-500" />}
                        endContent={<ItemCounter value={formatCurrency(patrimony.value)} />}
                        onClick={() => onSelectPatrimony(patrimony)}
                    >
                        {patrimony.name}
                    </ListboxItem>
                ))}
            </Listbox>
        </div>
    )
}