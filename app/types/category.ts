export type Category = {
    id: number;
    name: string;
    parent: string;
    icon: string;
    color: string;
    transactionType?: string;
}

export type ParentCategory = {
    name: string;
    color: string
}