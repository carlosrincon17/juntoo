export const ItemCounter = (props : {value: string}) => {
    const { value } = props;
    return (
        <div className="flex items-center gap-1 text-default-400">
        <span className="text-small">{value}</span>
        </div>
    )
};