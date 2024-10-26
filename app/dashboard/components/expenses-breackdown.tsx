import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { CustomLoading } from "@/app/components/customLoading";
import { formatCurrency } from "@/app/lib/currency";
import { CategoryExpense } from "@/app/types/expense";
import { Card, CardBody, Progress, Spacer } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";

export default function ExpensesBreackdown(props: { totalExpenses: number }) {
    const { totalExpenses } = props;

    const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
    const [loading, setLoading] = useState(true);

    const getCategoriesData = async () => {
        const categoriesData = await getTopCategoriesWithMostExpenses();
        setLoading(false);
        setCategoryExpenses(categoriesData);
    }

    useEffect(() => {
        getCategoriesData();
    }, []);

    return (
        <div>
            {loading ?
                <CustomLoading /> :
                <Card>
                    <CardBody className="p-6">
                        <h3 className="text-2xl font-semibold mb-4">Categories</h3>
                        {categoryExpenses.map((category, index) => (
                            <Fragment key={category.categoryName}>
                                <div className="flex justify-between items-center mb-2">
                                    <span>{category.categoryName}</span>
                                    <span className="font-semibold">{formatCurrency(category.totalExpenses)}</span>
                                </div>
                                <Progress 
                                    value={(category.totalExpenses  / totalExpenses) * 100} 
                                    color={"primary"}
                                    className="h-2 mb-3"
                                />
                                {index < categoryExpenses.length - 1 && <Spacer y={2} />}
                            </Fragment>
                        ))}
                    </CardBody>
                </Card>
            }
        </div>
    )
}