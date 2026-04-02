"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useStore, categoryConfig, type Category } from "@/lib/store"
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target, PiggyBank } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function Insights() {
  const { transactions, totalIncome, totalExpenses } = useStore()

  const insights = useMemo(() => {
    const categoryExpenses: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount
      })

    const sortedCategories = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)
    const highestCategory = sortedCategories[0]
    const lowestCategory = sortedCategories[sortedCategories.length - 1]

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthExpenses = transactions
      .filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === "expense"
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const lastMonthExpenses = transactions
      .filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.type === "expense"
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const currentMonthIncome = transactions
      .filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === "income"
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const lastMonthIncome = transactions
      .filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.type === "income"
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseChangePercent =
      lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

    const incomeChangePercent =
      lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    const avgMonthlyExpense = totalExpenses / Math.max(1, new Set(transactions.filter((t) => t.type === "expense").map((t) => t.date.substring(0, 7))).size)

    return {
      highestCategory,
      lowestCategory,
      expenseChangePercent,
      incomeChangePercent,
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncome,
      lastMonthIncome,
      savingsRate,
      avgMonthlyExpense,
    }
  }, [transactions, totalIncome, totalExpenses])

  const insightCards = [
    {
      title: "Highest Spending Category",
      value: insights.highestCategory
        ? categoryConfig[insights.highestCategory[0] as Category]?.label || insights.highestCategory[0]
        : "N/A",
      description: insights.highestCategory
        ? `You spent ${formatCurrency(insights.highestCategory[1])} on ${categoryConfig[insights.highestCategory[0] as Category]?.label || insights.highestCategory[0]}`
        : "No expense data available",
      icon: AlertCircle,
      iconColor: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Monthly Expense Change",
      value: `${insights.expenseChangePercent >= 0 ? "+" : ""}${insights.expenseChangePercent.toFixed(1)}%`,
      description:
        insights.expenseChangePercent > 0
          ? `Expenses increased by ${formatCurrency(insights.currentMonthExpenses - insights.lastMonthExpenses)} this month`
          : `Expenses decreased by ${formatCurrency(Math.abs(insights.currentMonthExpenses - insights.lastMonthExpenses))} this month`,
      icon: insights.expenseChangePercent <= 0 ? TrendingDown : TrendingUp,
      iconColor: insights.expenseChangePercent <= 0 ? "text-success" : "text-destructive",
      bgColor: insights.expenseChangePercent <= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    {
      title: "Monthly Income Change",
      value: `${insights.incomeChangePercent >= 0 ? "+" : ""}${insights.incomeChangePercent.toFixed(1)}%`,
      description:
        insights.incomeChangePercent >= 0
          ? `Income increased by ${formatCurrency(Math.abs(insights.currentMonthIncome - insights.lastMonthIncome))} this month`
          : `Income decreased by ${formatCurrency(Math.abs(insights.currentMonthIncome - insights.lastMonthIncome))} this month`,
      icon: insights.incomeChangePercent >= 0 ? TrendingUp : TrendingDown,
      iconColor: insights.incomeChangePercent >= 0 ? "text-success" : "text-destructive",
      bgColor: insights.incomeChangePercent >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    {
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      description:
        insights.savingsRate >= 20
          ? "Great job! You are saving a healthy portion of your income"
          : insights.savingsRate >= 10
            ? "Good progress! Try to increase your savings rate to 20%"
            : "Consider reducing expenses to improve your savings rate",
      icon: PiggyBank,
      iconColor: insights.savingsRate >= 20 ? "text-success" : "text-warning",
      bgColor: insights.savingsRate >= 20 ? "bg-success/10" : "bg-warning/10",
    },
    {
      title: "Average Monthly Expense",
      value: formatCurrency(insights.avgMonthlyExpense),
      description: "Your average monthly spending based on all recorded transactions",
      icon: Target,
      iconColor: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Financial Tip",
      value: insights.savingsRate < 20 ? "Increase Savings" : "Keep It Up!",
      description:
        insights.savingsRate < 20
          ? `Try reducing spending on ${insights.highestCategory ? categoryConfig[insights.highestCategory[0] as Category]?.label || insights.highestCategory[0] : "your top category"} to boost savings`
          : "Your finances are in great shape. Consider investing your surplus",
      icon: Lightbulb,
      iconColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Financial Insights</CardTitle>
        <CardDescription className="text-muted-foreground">
          Key observations and recommendations based on your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insightCards.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4"
            >
              <div className={`rounded-full ${insight.bgColor} p-2.5`}>
                <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </p>
                <p className="text-lg font-semibold text-foreground mt-0.5">
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
