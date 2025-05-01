'use server'

import { getUser } from "@/app/actions/auth";
import { FinancialMetrics } from "@/app/types/financial";
import { ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";;
import { sql } from "drizzle-orm";

export const getFinancialMetrics = async (currentDate: Date): Promise<FinancialMetrics> => {
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const user = await getUser();

    const result = await db.execute<{
      current_expenses: number;
      current_investment_income: number;
      current_savings: number;
      last_expenses: number;
      last_investment_income: number;
      last_savings: number;
  }>(sql`
      WITH current_metrics AS (
          SELECT
              COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as current_expenses,
              COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) as current_investment_income,
              COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) -
              COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as current_savings
          FROM ${ExpensesTable}
          WHERE 
              family_id = ${user.familyId} AND
              EXTRACT(YEAR FROM "createdAt") = ${currentYear} AND
              EXTRACT(MONTH FROM "createdAt") = ${currentMonth} AND
              EXTRACT(DAY FROM "createdAt") <= ${currentDay}
      ),
      last_metrics AS (
          SELECT
              COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as last_expenses,
              COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) as last_investment_income,
              COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) -
              COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as last_savings
          FROM ${ExpensesTable}
          WHERE 
              family_id = ${user.familyId} AND
              EXTRACT(YEAR FROM "createdAt") = ${lastMonthYear} AND
              EXTRACT(MONTH FROM "createdAt") = ${lastMonth} AND
              EXTRACT(DAY FROM "createdAt") <= ${currentDay}
      )
      SELECT 
          cm.current_expenses,
          cm.current_investment_income,
          cm.current_savings,
          lm.last_expenses,
          lm.last_investment_income,
          lm.last_savings
      FROM current_metrics cm, last_metrics lm;
  `);

    const {
        current_expenses,
        current_investment_income,
        current_savings,
        last_expenses,
        last_investment_income,
        last_savings
    } = result.rows[0];

    const calculateVariation = (current: number, previous: number): number => {
        if (previous === 0) return current === 0 ? 0 : 100;
        return ((current - previous) / previous) * 100;
    };

    return {
        expenses: {
            total: Number(current_expenses),
            last: Number(last_expenses),
            variationPercentage: calculateVariation(Number(current_expenses), Number(last_expenses)),
            variationTotal: Number(current_expenses) - Number(last_expenses)
        },
        investmentIncome: {
            total: Number(current_investment_income),
            last: Number(last_investment_income),
            variationPercentage: calculateVariation(Number(current_investment_income), Number(last_investment_income)),
            variationTotal: Number(current_investment_income) - Number(last_investment_income)
        },
        savings: {
            total: Number(current_savings),
            last: Number(last_savings),
            variationPercentage: calculateVariation(Number(current_savings), Number(last_savings)),
            variationTotal: Number(current_savings) - Number(last_savings)
        }
    };
}