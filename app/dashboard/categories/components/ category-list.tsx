import { Category } from "@/app/types/category";
import { Card, CardBody, CardFooter, Chip, Divider } from "@nextui-org/react";

export default function CategoryList(props: { categories: Category[], onAddExpense: (category: Category) => void }) {
    const { categories, onAddExpense } = props;

    const getCategories = () => {
        return categories.map((category) => {
            return (
                <Card className={`w-[250px] bg-indigo-500`} key={category.id} 
                    isFooterBlurred 
                    isPressable
                    onPress={() => onAddExpense(category)}>
                    <CardBody>
                        <h3 className="font-extralight text-2xl">{category.name}</h3>
                    </CardBody>
                    <Divider/>
                    <CardFooter className="bg-indigo-700 flex flex-col-reverse items-end">
                        <Chip className="text-small font-light">{category.parent}</Chip>
                    </CardFooter>
                </Card>
            )
        })
    }   

    return (
        <div className="mt-10 flex flex-wrap gap-4">
            {getCategories()}
        </div>
    )
}