import { Category } from "@/app/types/category";
import { Savings } from "@/app/types/saving";
import { CategoryTable, SavingsTable, ExpensesTable, PeriodicPaymentsTable } from "@/drizzle/schema";
import { TransactionType } from "@/utils/enums/transaction-type";
import { db } from "@/utils/storage/db";
import { and, eq, gte, lte } from "drizzle-orm";
import { PeriodicPayment } from "@/app/types/periodic-payment";

export const dynamic = 'force-dynamic';


const saveInvestmentIncomes = async (saving: Savings, dailyInterest: number, investmentCategory: Category) => {
    const newExpense = {
        createdBy: saving.owner,
        value: dailyInterest,
        category_id: investmentCategory.id,
        transactionType: TransactionType.Income,
        budgetId: null,
        createdAt: new Date(),
        userId: saving.userId,
        familyId: saving.familyId,
    };
    console.log("newExpense", newExpense);
    if (process.env.CRON_ENABLE !== 'yes') {
        console.log("CRON is NOT enabled");
        return;
    }
    await db.insert(ExpensesTable).values(newExpense);
}

const isPaymentDue = (payment: PeriodicPayment, today: Date): boolean => {
    // Helper to get UTC date (YYYY-MM-DD) from a Date object, assuming the Date object represents the correct calendar date in its context
    // But here, payment.lastApplied from DB is UTC midnight.
    // payment.startDate might be local or UTC.
    // today is local.

    // We want to compare "Calendar Dates".
    // Let's convert everything to a comparable string YYYY-MM-DD based on the intended timezone.
    // Assuming the server runs in the user's timezone or we want to use the server's local date as "today".

    const getLocalYMD = (d: Date) => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const getDbDateAsLocal = (d: Date) => {
        // DB returns UTC midnight for 'date' type.
        // We want to treat "2025-12-12" from DB as "2025-12-12" local.
        // So we extract UTC components and make a local date.
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    };

    const lastAppliedLocal = payment.lastApplied ? getDbDateAsLocal(new Date(payment.lastApplied)) : null;
    const startDateLocal = getDbDateAsLocal(new Date(payment.startDate)); // Assuming startDate is also stored as date
    const todayLocal = getLocalYMD(today);

    const referenceDateLocal = lastAppliedLocal || startDateLocal;

    // If using startDate and it's in the future, it's not due
    if (!lastAppliedLocal && todayLocal < referenceDateLocal) {
        return false;
    }

    // If lastApplied is today, it's already done
    if (lastAppliedLocal && todayLocal.getTime() === lastAppliedLocal.getTime()) {
        return false;
    }

    switch (payment.frequency) {
    case 'daily':
        // If lastApplied was yesterday or before, it's due today
        if (lastAppliedLocal) {
            return todayLocal > lastAppliedLocal;
        }
        return true;
    case 'weekly':
        if (lastAppliedLocal) {
            const diffTime = Math.abs(todayLocal.getTime() - lastAppliedLocal.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 7;
        }
        return todayLocal.getDay() === startDateLocal.getDay();
    case 'monthly':
        if (lastAppliedLocal) {
            // Check if it's a new month and the day matches or is the last day of month
            if (todayLocal.getMonth() === lastAppliedLocal.getMonth() && todayLocal.getFullYear() === lastAppliedLocal.getFullYear()) {
                return false; // Already paid this month
            }
        }

        // Logic for monthly due date
        const expectedDay = startDateLocal.getDate();
        const daysInMonth = new Date(todayLocal.getFullYear(), todayLocal.getMonth() + 1, 0).getDate();

        if (expectedDay > daysInMonth) {
            return todayLocal.getDate() === daysInMonth;
        }
        return todayLocal.getDate() === expectedDay;
    case 'yearly':
        if (lastAppliedLocal) {
            if (todayLocal.getFullYear() === lastAppliedLocal.getFullYear()) {
                return false; // Already paid this year
            }
        }
        return todayLocal.getMonth() === startDateLocal.getMonth() &&
                todayLocal.getDate() === startDateLocal.getDate();
    default:
        return false;
    }
};

const processPeriodicPayments = async () => {
    console.log("Processing periodic payments...");
    const periodicPayments = await db.query.PeriodicPaymentsTable.findMany();
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    for (const payment of periodicPayments) {
        if (isPaymentDue(payment as PeriodicPayment, today)) {
            console.log(`Payment ${payment.name} is due today.`);

            // Check for duplicates using periodicPaymentId
            const existingExpense = await db.query.ExpensesTable.findFirst({
                where: and(
                    eq(ExpensesTable.periodicPaymentId, payment.id),
                    gte(ExpensesTable.createdAt, startOfDay),
                    lte(ExpensesTable.createdAt, endOfDay)
                )
            });

            if (existingExpense) {
                console.log(`Expense for payment ${payment.name} already exists for today. Skipping.`);
                continue;
            }

            const newExpense = {
                createdBy: `PeriodicPayment:${payment.id}`, // Keep for backward compatibility or reference
                value: payment.value,
                category_id: payment.category_id,
                transactionType: payment.transactionType,
                budgetId: null,
                createdAt: today,
                userId: payment.userId,
                familyId: payment.familyId,
                periodicPaymentId: payment.id,
            };

            if (process.env.CRON_ENABLE === 'yes') {
                await db.transaction(async (tx) => {
                    await tx.insert(ExpensesTable).values(newExpense);
                    await tx.update(PeriodicPaymentsTable)
                        .set({ lastApplied: today })
                        .where(eq(PeriodicPaymentsTable.id, payment.id));
                });
                console.log(`Created expense for payment ${payment.name} and updated lastApplied`);
            } else {
                console.log("CRON is NOT enabled, skipping insert for", newExpense);
            }
        }
    }
};

export async function GET(request: Request) {
    const savingsAccount = await db.query.SavingsTable.findMany({
        where: and(
            eq(SavingsTable.currency, 'COP'),
            eq(SavingsTable.isInvestment, true),
        )
    });
    const investmentCategory = await db.query.CategoryTable.findFirst({
        where: eq(CategoryTable.name, 'Inversion'),
    });
    if (!investmentCategory) {
        return new Response(`Category Inversion not found`, { status: 404 });
    }
    const validSavingsToProcess = savingsAccount.filter((saving) => saving.isInvestment && saving.annualInterestRate);
    const groupedByUser: Record<string, Savings[]> = {
    }
    validSavingsToProcess.forEach((saving) => {
        if (!saving.familyId) {
            return;
        }
        if (!groupedByUser[saving.familyId]) {
            groupedByUser[saving.familyId] = [];
        }
        groupedByUser[saving.familyId].push(saving);
    });
    await Promise.all(Object.keys(groupedByUser).map(async (familyId: string) => {
        if (!familyId) {
            return;
        }
        if (!groupedByUser[familyId]) {
            return;
        }
        const savings = groupedByUser[familyId];
        const dailyInterest = savings.reduce((acc, saving) => {
            const annualInterestRate = saving.annualInterestRate || 0;
            const dailyInterestSaving = parseFloat((saving.value * ((annualInterestRate / 365) / 100)).toFixed(0));
            return acc + dailyInterestSaving;
        }, 0);
        return await saveInvestmentIncomes(savings[0], dailyInterest, investmentCategory);
    }));

    await processPeriodicPayments();

    return new Response(`Hello from ${process.env.CRON_ENABLE}, ${request.url}`);
}