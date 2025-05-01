export function getAttribute<T extends object>(obj: T, key: string): T[keyof T] | undefined {
    if (key in obj) {
        return obj[key as keyof T];
    }
    return undefined;
}

export function groupBy<T, K extends keyof string | number | symbol>(array: T[], keyGetter: (item: T) => K): Record<K, T[]> {
    return array.reduce((result, currentItem) => {
        const key = keyGetter(currentItem);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(currentItem);
        return result;
    }, {} as Record<K, T[]>);
}