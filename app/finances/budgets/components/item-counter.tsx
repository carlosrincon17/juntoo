export const ItemCounter = (props : {value: string}) => {
    const { value } = props;
    return (
        <div className="flex items-center gap-1">
            <span className="font-bold">{value}</span>
        </div>
    )
};