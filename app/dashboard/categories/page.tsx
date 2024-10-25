'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/ category-list";
import { CustomLoading } from "@/app/components/customLoading";
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Expense } from "@/app/types/expense";
import { getUser } from "@/app/actions/auth";
import { addExpense } from "@/app/actions/expenses";
import toast from "react-hot-toast";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [expense, setExpense] = useState<Expense>({
        value: 0,
        category_id: 0,
    });
    const [user, setUser] = useState("--");

    const page = 0;
    const perPage = 10;
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getCategoriesData = async () => {
        const categoriesData = await getCategories(page, perPage);
        setLoading(false);
        setCategories(categoriesData);
    }

    const getUserData = async () => {
        const userData = await getUser();
        setUser(userData);
    }

    const saveExpense = async (onClose: () => void) => {
        await addExpense(expense);
        toast.success(`Agregado $ ${expense.value} por ${expense.category?.name}.`, {
            position: "bottom-center",
        });
        onClose();
    }

    const onAddExpense = async (category: Category) => {
        setExpense({category, createdBy: user, value: 0, category_id: category.id});
        onOpen()
    }
    
    useEffect(() => {
        getUserData();
        getCategoriesData();
    }, [page, perPage]);

    return (
        <div>
            {loading && <CustomLoading /> }
            <CategoryList categories={categories} onAddExpense={(category: Category) => onAddExpense(category)}/>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-4">
                                <h2 className="text-lg font-extralight"> {expense.category?.name}</h2>
                                <Chip color="primary" size="sm" variant="flat">
                                    {expense.category?.parent}
                                </Chip>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    type="number"
                                    label="Valor"
                                    placeholder="0"
                                    labelPlacement="inside"
                                    value={`${expense.value}`}
                                    onChange={(e) => setExpense({...expense, value: parseInt(e.target.value, 10)})}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$COP</span>
                                        </div>
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => saveExpense(onClose)}>
                                    Add Expense
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}