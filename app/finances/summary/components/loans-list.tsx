'use client'

import { Listbox, ListboxItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ItemCounter } from "./item-counter";
import { formatCurrency } from "@/app/lib/currency";
import { FaCircle } from "react-icons/fa";
import { getLoans } from "../actions/loans";
import { Loan } from "@/app/types/loans";

export default function LoanList(props: {
    onSelectLoan: (loan: Loan) => void}
) {

    const { onSelectLoan } = props;
    const [loans, setLoans] = useState<Loan[]>([]);


    const getLoansData = async () => {
        const loansData = await getLoans();
        setLoans(loansData);
    }

    useEffect(() => {
        getLoansData();
    }, []);

    return (
        <div className="full-width">
            <Listbox
                className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible shadow-small rounded-medium"
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                }}
            >
                {loans.map((loan) => (
                    <ListboxItem key={loan.id} value={loan.id}
                        startContent={<FaCircle className="text-orange-500" />}
                        endContent={<ItemCounter value={formatCurrency(loan.value)} />}
                        onClick={() => onSelectLoan(loan)}
                    >
                        {loan.name}
                    </ListboxItem>
                ))}
            </Listbox>
        </div>
    )
}