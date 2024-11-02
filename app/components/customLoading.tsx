import './styles.modules.css'

export const CustomLoading = (props: {
    message?: string
} & React.HTMLAttributes<HTMLDivElement>) => {
    const message = props.message || 'Cargando ...';
    return (
        <div className={"flex flex-col justify-center items-center mt-4 " + props.className}>
            <div className="loader w-full"></div>
            <div className='text-medium font-extralight mt-2'>{message}</div>
        </div>
    )
}
