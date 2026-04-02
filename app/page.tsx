"use client"

import { StoreProvider } from "@/lib/store"
import { DashboardHeader } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { Insights } from "@/components/dashboard/insights"

export default function DashboardPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-muted-foreground mt-1">
              Track your income, expenses, and financial health
            </p>
          </div>

          <div className="space-y-6">
            <SummaryCards />

            <div className="grid gap-6 lg:grid-cols-2">
              <BalanceChart />
              <SpendingChart />
            </div>

            <Insights />

            <TransactionsTable />
          </div>
        </main>
      </div>
    </StoreProvider>
  )
}
