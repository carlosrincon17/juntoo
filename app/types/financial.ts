export interface FinancialData {
  month: string
  expenses: number
  income: number
  savings: number
}

export interface FinancialDataWithPercentage extends FinancialData {
  savingsPercentage: number
}

export interface FinancialStats {
  avgExpenses: number
  avgIncome: number
  avgSavings: number
  avgSavingsPercentage: number
  dataWithPercentage: FinancialDataWithPercentage[]
}

export interface StatCardProps {
  title: string
  value: string
  color: string
}

export interface ChartData {
  months: string[]
  series: ApexAxisChartSeries
  savingsPercentageSeries: ApexAxisChartSeries
}

export interface FinancialMetric {
  total: number;
  last: number;
  variationPercentage: number;
  variationTotal: number;
}

export interface FinancialMetrics {
  expenses: FinancialMetric;
  investmentIncome: FinancialMetric;
  savings: FinancialMetric;
}

export interface FinancialCategoryData { 
  categoryParent: string; 
  totalsByMonth: { month: string; total: number }[]
}