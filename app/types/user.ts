import { Family } from "./family";

export type User = {
    id?: number;
    name: string;
    email: string;
    createdAt?: Date;
    familyId: number;
    isActive: boolean;
    isAdmin: boolean;
    family?: Family;
}