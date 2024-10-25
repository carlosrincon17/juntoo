import { Spinner } from "@nextui-org/react"

export const CustomLoading = () => {
    return (
        <div className="flex justify-center">
            <Spinner label="Loading..." color="primary" size="lg"/>
        </div>
    )
}