'use server'

import { getUser } from "@/app/actions/auth";
import { FinancialMetrics } from "@/app/types/financial";
import { ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";;
import { sql } from "drizzle-orm";


export const getFinancialMetrics = async (): Promise<FinancialMetrics> => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const user = await getUser();

    const result = await db.execute<{
        total_expenses: number;
        total_investment_income: number;
        total_savings: number;
        avg_expenses: number;
        avg_investment_income: number;
        avg_savings: number;
      }>(sql`
        WITH current_metrics AS (
          SELECT
            COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as total_expenses,
            COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) as total_investment_income,
            COALESCE(SUM(CASE WHEN transaction_type = 'saving' THEN value ELSE 0 END), 0) as total_savings
          FROM ${ExpensesTable}
          WHERE 
            family_id = ${user.familyId} AND
            EXTRACT(YEAR FROM "createdAt") = ${currentYear} AND
            EXTRACT(MONTH FROM "createdAt") = ${currentMonth} AND
            EXTRACT(DAY FROM "createdAt") <= ${currentDay}
        ),
        historical_averages AS (
          SELECT
            AVG(monthly_expenses) as avg_expenses,
            AVG(monthly_investment_income) as avg_investment_income,
            AVG(monthly_savings) as avg_savings
          FROM (
            SELECT
              EXTRACT(YEAR FROM "createdAt") as year,
              EXTRACT(MONTH FROM "createdAt") as month,
              COALESCE(SUM(CASE WHEN transaction_type = 'OUTCOME' THEN value ELSE 0 END), 0) as monthly_expenses,
              COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN value ELSE 0 END), 0) as monthly_investment_income,
              COALESCE(SUM(CASE WHEN transaction_type = 'saving' THEN value ELSE 0 END), 0) as monthly_savings
            FROM ${ExpensesTable}
            WHERE 
              family_id = ${user.familyId} AND
              (EXTRACT(YEAR FROM "createdAt") < ${currentYear} OR 
               (EXTRACT(YEAR FROM "createdAt") = ${currentYear} AND 
                EXTRACT(MONTH FROM "createdAt") < ${currentMonth})) AND
              EXTRACT(DAY FROM "createdAt") <= ${currentDay}
            GROUP BY 
              EXTRACT(YEAR FROM "createdAt"),
              EXTRACT(MONTH FROM "createdAt")
          ) as monthly_totals
        )
        SELECT 
          cm.total_expenses,
          cm.total_investment_income,
          cm.total_savings,
          COALESCE(ha.avg_expenses, 0) as avg_expenses,
          COALESCE(ha.avg_investment_income, 0) as avg_investment_income,
          COALESCE(ha.avg_savings, 0) as avg_savings
        FROM current_metrics cm, historical_averages ha
      `);
    
    const {
        total_expenses,
        total_investment_income,
        total_savings,
        avg_expenses,
        avg_investment_income,
        avg_savings
    } = result.rows[0];
    
    const calculateVariation = (current: number, average: number): number => {
        if (average === 0) return current === 0 ? 0 : 100;
        return ((current - average) / average) * 100;
    };
    
    return {
        expenses: {
            total: Number(total_expenses),
            average: Number(avg_expenses),
            variationPercentage: calculateVariation(Number(total_expenses), Number(avg_expenses))
        },
        investmentIncome: {
            total: Number(total_investment_income),
            average: Number(avg_investment_income),
            variationPercentage: calculateVariation(Number(total_investment_income), Number(avg_investment_income))
        },
        savings: {
            total: Number(total_savings),
            average: Number(avg_savings),
            variationPercentage: calculateVariation(Number(total_savings), Number(avg_savings))
        }
    };
}
