export function getAttribute<T extends object>(obj: T, key: string): T[keyof T] | undefined {
    if (key in obj) {
        return obj[key as keyof T];
    }
    return undefined;
}
