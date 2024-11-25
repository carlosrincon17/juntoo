import { Category } from "@/app/types/category";
import { Savings } from "@/app/types/saving";
import { CategoryTable, SavingsTable, ExpensesTable } from "@/drizzle/schema";
import { TransactionType } from "@/utils/enums/transaction-type";
import { db } from "@/utils/storage/db";
import { and, eq } from "drizzle-orm";

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
        console.log("CRON is not enabled");
        return;
    }
    await db.insert(ExpensesTable).values(newExpense);
}

export async function GET(request: Request) {
    const savingsAccount =  await db.query.SavingsTable.findMany({
        where: and(
            eq(SavingsTable.currency, 'COP'),
            eq(SavingsTable.isInvestment, true),
        )
    });
    console.log("savings account to process", savingsAccount);
    const investmentCategory = await db.query.CategoryTable.findFirst({
        where: eq(CategoryTable.name, 'Inversion'),
    });
    if (!investmentCategory) {
        return new Response(`Category Inversion not found`, { status: 404 });
    }
    const validSavingsToProcess = savingsAccount.filter((saving) => saving.isInvestment && saving.annualInterestRate);
    await Promise.all(validSavingsToProcess.map(async(saving) => {
        const annualInterestRate = saving.annualInterestRate || 0;
        const dailyInterest = (saving.value * ((annualInterestRate / 365) / 100)).toFixed(0);
        return await saveInvestmentIncomes(saving, parseInt(dailyInterest), investmentCategory);
    }));
    return new Response(`Hello from ${process.env.CRON_ENABLE}, ${request.url}`);
}