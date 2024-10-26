import { Spinner } from "@nextui-org/react"

export const CustomLoading = (props: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={"flex justify-center " + props.className}>
            <Spinner label="Loading..." color="primary" size="lg"/>
        </div>
    )
}