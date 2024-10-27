import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { getTransactionTypeLabel } from "@/app/lib/labels";
import { CategoryExpense } from "@/app/types/expense";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Card, CardBody, Progress, Spacer } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";

export default function ExpensesBreackdown(props: { totalExpenses: number, expensesFilter: ExpensesFilters, transactionType: TransactionType }) {
    const { totalExpenses, expensesFilter, transactionType } = props;

    const [transactionSummary, setTransactionSummary] = useState<CategoryExpense[]>([]);
    const [loading, setLoading] = useState(true);

    const color = transactionType === TransactionType.Income ? 'primary' : 'danger';
    const getTransactionListData = async () => {
        const transactionsData = await getTopCategoriesWithMostExpenses(expensesFilter, transactionType);
        setLoading(false);
        setTransactionSummary(transactionsData);
    }

    useEffect(() => {
        getTransactionListData();
    }, [expensesFilter]);

    return (
        <div>
            {loading ?
                <CustomLoading /> :
                <Card>
                    <CardBody className="p-6">
                        <h3 className="text-2xl font-semibold mb-4">Resumen de {getTransactionTypeLabel(transactionType, true)} </h3>
                        {transactionSummary.map((category, index) => (
                            <Fragment key={category.categoryName}>
                                <div className="flex justify-between items-center mb-2">
                                    <span>{category.categoryName}</span>
                                    <span className="font-semibold">{formatCurrency(category.totalExpenses)}</span>
                                </div>
                                <Progress 
                                    value={(category.totalExpenses  / totalExpenses) * 100} 
                                    color={color}
                                    className="h-2 mb-3"
                                />
                                {index < transactionSummary.length - 1 && <Spacer y={2} />}
                            </Fragment>
                        ))}
                    </CardBody>
                </Card>
            }
        </div>
    )
}