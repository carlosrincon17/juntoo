export type SnapshotSavingItem = {
    id: number;
    name: string;
    value: number;
    copValue: number;
    currency: string;
    owner: string;
    isInvestment: boolean;
    annualInterestRate: number | null;
    goalName: string | null;
};

export type SnapshotPatrimonyItem = {
    id: number;
    name: string;
    value: number;
};

export type SnapshotDebtItem = {
    id: number;
    name: string;
    value: number;
    initialAmount: number;
};

export type SnapshotTotals = {
    savings: number;
    assets: number;
    debts: number;
    balance: number;
    savingsCount: number;
    assetsCount: number;
    debtsCount: number;
};

export type ConsolidatedSnapshotListItem = {
    id: number;
    note: string | null;
    createdAt: Date;
    createdByName: string;
    totals: SnapshotTotals;
};

export type ConsolidatedSnapshotDetail = ConsolidatedSnapshotListItem & {
    savings: SnapshotSavingItem[];
    patrimonies: SnapshotPatrimonyItem[];
    debts: SnapshotDebtItem[];
};
