import { Card } from "@heroui/react";
import AccountCard from "./account-card";
import { FaPlus } from "react-icons/fa";
import { Loan } from "@/app/types/loans";

interface LoanListProps {
    loans: Loan[],
}

export default function LoansList({ loans }: LoanListProps) {

    const gradient = "from-[#f97066] via-[#f43f5e] to-[#fb7185]"

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {loans.map((loan) => (
                    <AccountCard 
                        key={loan.id} 
                        name={loan.name} 
                        value={loan.value} 
                        onEdit={() => console.log(loan)} 
                        onDelete={() => console.log(loan)} 
                        gradient={gradient}
                        textColor="text-white"
                    />
                ))}
                <Card
                    className={`overflow-hidden border-none shadow-sm rounded-2xl cursor-pointer bg-gradient-to-br from-[#f97066]/5 via-[#f43f5e]/5 to-[#fb7185]/5 hover:shadow-md transition-shadow duration-300`}
                >
                    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[140px]">
                        <div
                            className={`rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center p-3 mb-3 shadow-sm`}
                        >
                            <FaPlus className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-light text-[#121432]/70">Nueva prestamo</p>
                    </div>
                </Card>
            </div>
                    
        </>
    )
}