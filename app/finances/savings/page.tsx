'use client'

import { Savings } from "@/app/types/saving";
import { useEffect, useState } from "react";
import { deleteSaving, getSavings } from "./actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import SavingsManagerModal from "./component/savings-manager";
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { FaEllipsisV } from "react-icons/fa";
import ConfirmModal from "@/app/components/confirmModal";
import { FloatingAddButton } from "@/app/components/floating-buttton";
import SummarySection from "./component/summary-section";
import TabsActive from "./component/tabs-active";
import { Patrimony } from "@/app/types/patrimony";
import { Debts } from "@/app/types/debts";
import { getPatrimonies } from "../summary/actions/patrimonies";
import { getDebts } from "../summary/actions/debts";

const savingBase: Savings = {
    id: 0,
    name: "",
    value: 0,
    owner: "",
    userId: null,
    familyId: null,
    isInvestment: false,
}

type SummaryData = {
    savings: number,
    assets: number,
    debts: number,
    balance: number,
}

export default function Page() {
    const [savings, setSavings] = useState<Savings[]>([]);
    const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
    const [debts, setDebts] = useState<Debts[]>([]);
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        savings: 0,
        assets: 0,
        debts: 0,
        balance: 0,
    });
    const [selectedSavings, setSelectedSavings] = useState<Savings>({...savingBase});
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange} = useDisclosure();


    const loadSummaryData = async () => {
        const savingsSum = savings.reduce((total, saving) => total + saving.value, 0);
        const assetsSum = patrimonies.reduce((total, saving) => total + saving.value, 0);
        const debtsSum = debts.reduce((total, saving) => total + saving.value, 0);
        const balanceSum = savingsSum + assetsSum - debtsSum;
        setSummaryData({
            savings: savingsSum,
            assets: assetsSum,
            debts: debtsSum,
            balance: balanceSum,
        });
    }

    const getSavingsData = async () => {
        const savingsData = await getSavings();
        setSavings(savingsData);
    }

    const getPatrimoniesData = async () => {
        const patrimoniesData = await getPatrimonies();
        setPatrimonies(patrimoniesData);
    }

    const getDebtsData = async () => {
        const debtsData = await getDebts();
        setDebts(debtsData);
    }

    const afterSaveSavings = async () => {
        getSavingsData();
    }

    const onClickSavings = (savings: Savings) => {
        setSelectedSavings(savings);
        onOpen();
    }

    const onClickDeleteSaving = (savings: Savings) => {
        setSelectedSavings(savings);
        onDeleteModalOpen();
    }

    const onCreateNewSavingClick = async () => {
        const newSaving: Savings = {...savingBase};
        setSelectedSavings(newSaving);
        onOpen();
    }

    const onConfirmDeleteSaving = async (onClose: () => void) => {
        await deleteSaving(selectedSavings?.id as number);
        onClose();
        getSavingsData();
    }

    const loadInitialData = async () => {
        setLoading(true);
        await getSavingsData();
        await getPatrimoniesData();
        await getDebtsData();
        loadSummaryData();
        setLoading(false);
    }

    useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <div>
            {
                loading ? 
                    <CustomLoading /> :
                    <div className="space-y-6">
                        <SummarySection savings={summaryData.savings} assets={summaryData.assets} debts={summaryData.debts} balance={summaryData.balance} />
                        <TabsActive onSelectTab={(tab) => console.log(tab)} />
                        <FloatingAddButton 
                            onClick={onCreateNewSavingClick}
                            label="Agregar ahorro"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            {savings.map((saving) => (
                                <Card className="shadow-md"
                                    key={saving.id} 
                                >
                                    <CardBody>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h2 className="text-lg font-extralight text-gray-800">{saving.name}</h2>
                                            </div>
                                            <div className="text-right">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <FaEllipsisV className="hover:cursor-pointer"></FaEllipsisV>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Static Actions">
                                                        <DropdownItem onPress={() => onClickSavings(saving)} key={`edit-${saving.id}`}>
                                                            Editar
                                                        </DropdownItem>
                                                        <DropdownItem onPress={() => onClickDeleteSaving(saving)} className="text-red-600" key={`delete-${saving.id}`}>
                                                            Eliminar
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className="grid flex-row grid-cols-1 md:grid-cols-2">
                                            <div>
                                                <p className="text-2xl font-medium">
                                                    {formatCurrency(saving.value)}
                                                    <span className="text-xs font-light"></span>
                                                </p>
                                                <p className="text-xs font-light">{saving.currency} / {saving.user?.name}</p>
                                            </div>
                                            <div className="md:text-right">
                                                <p className="text-xs font-light">Interes anual</p>
                                                <p className={"font-light text-2xl "}>{
                                                    saving.isInvestment ? 
                                                        <span> {saving.annualInterestRate} % </span>:
                                                        <span> N/A </span>
                                                }
                                                </p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                        <SavingsManagerModal isOpen={isOpen} savings={selectedSavings} onOpenChange={onOpenChange} afterSaveSavings={afterSaveSavings} />
                        <ConfirmModal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange} title="Eliminar ahorro" message="¿Estás seguro de que quieres eliminar este ahorro?" onConfirm={onConfirmDeleteSaving} />
                    </div>
            }
        </div>
    )
}