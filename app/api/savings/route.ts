import { Category } from "@/app/types/category";
import { Savings } from "@/app/types/saving";
import { CategoryTable, SavingsTable, ExpensesTable } from "@/drizzle/schema";
import { TransactionType } from "@/utils/enums/transaction-type";
import { db } from "@/utils/storage/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';
 
const ANNUAL_INTEREST_RATE = 0.12;


const saveInvestmentIncomes = async (saving: Savings, dailyInterest: number, investmentCategory: Category) => {
  const newExpense = {
    createdBy: saving.owner,
    value: dailyInterest,
    category_id: investmentCategory.id,
    transactionType: TransactionType.Income,
    budgetId: null,
    createdAt: new Date(),
  };
  console.log("newExpense", newExpense);
  if (process.env.CRON_ENABLE !== 'yes') {
    console.log("CRON is not enabled");
    return;
  }
  await db.update(SavingsTable).set(saving).where(eq(SavingsTable.id, saving.id));
  await db.insert(ExpensesTable).values(newExpense);
}

export async function GET(request: Request) {
    const savingsAccount =  await db.query.SavingsTable.findMany({
      where: eq(SavingsTable.currency, 'COP'),
    });
    const investmentCategory = await db.query.CategoryTable.findFirst({
      where: eq(CategoryTable.name, 'Inversion'),
    });
    if (!investmentCategory) {
      return new Response(`Category Inversion not found`, { status: 404 });
    }
    savingsAccount.forEach(saving => {
      const dailyInterest = (saving.value * (ANNUAL_INTEREST_RATE/365)).toFixed(0);
      saving.value = saving.value + parseInt(dailyInterest);
      saveInvestmentIncomes(saving, parseInt(dailyInterest), investmentCategory);
    });
    return new Response(`Hello from ${process.env.CRON_ENABLE}, ${request.url}`);
}