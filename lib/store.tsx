"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

export type Role = "viewer" | "admin"

export type TransactionType = "income" | "expense"

export type Category =
  | "salary"
  | "freelance"
  | "investment"
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "utilities"
  | "healthcare"
  | "other"

export interface Transaction {
  id: string
  date: string
  amount: number
  category: Category
  type: TransactionType
  description: string
}

interface FilterState {
  search: string
  type: TransactionType | "all"
  category: Category | "all"
  sortBy: "date" | "amount"
  sortOrder: "asc" | "desc"
}

interface StoreContextType {
  transactions: Transaction[]
  role: Role
  filters: FilterState
  setRole: (role: Role) => void
  setFilters: (filters: Partial<FilterState>) => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  editTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  filteredTransactions: Transaction[]
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

const StoreContext = createContext<StoreContextType | null>(null)

const initialTransactions: Transaction[] = [
  { id: "1", date: "2026-04-01", amount: 5000, category: "salary", type: "income", description: "Monthly Salary" },
  { id: "2", date: "2026-03-20", amount: 1200, category: "freelance", type: "income", description: "Web Development Project" },
  { id: "3", date: "2026-03-23", amount: 85, category: "food", type: "expense", description: "Grocery Shopping" },
  { id: "4", date: "2026-03-20", amount: 45, category: "transport", type: "expense", description: "Gas Station" },
  { id: "5", date: "2026-04-02", amount: 250, category: "shopping", type: "expense", description: "New Headphones" },
  { id: "6", date: "2026-04-01", amount: 120, category: "utilities", type: "expense", description: "Electric Bill" },
  { id: "7", date: "2026-03-07", amount: 65, category: "entertainment", type: "expense", description: "Movie Night" },
  { id: "8", date: "2026-03-08", amount: 800, category: "investment", type: "income", description: "Dividend Payment" },
  { id: "9", date: "2026-03-09", amount: 150, category: "healthcare", type: "expense", description: "Doctor Visit" },
  { id: "10", date: "2026-03-10", amount: 200, category: "food", type: "expense", description: "Restaurant Dinner" },
  { id: "11", date: "2026-03-15", amount: 5000, category: "salary", type: "income", description: "Monthly Salary" },
  { id: "12", date: "2026-03-18", amount: 95, category: "food", type: "expense", description: "Grocery Shopping" },
  { id: "13", date: "2026-03-20", amount: 300, category: "shopping", type: "expense", description: "Winter Jacket" },
  { id: "14", date: "2026-03-22", amount: 55, category: "transport", type: "expense", description: "Bus Pass" },
  { id: "15", date: "2026-03-25", amount: 600, category: "freelance", type: "income", description: "Logo Design" },
  { id: "16", date: "2026-03-28", amount: 180, category: "utilities", type: "expense", description: "Internet + Phone" },
  { id: "17", date: "2026-02-10", amount: 5000, category: "salary", type: "income", description: "Monthly Salary" },
  { id: "18", date: "2026-02-14", amount: 350, category: "entertainment", type: "expense", description: "Concert Tickets" },
  { id: "19", date: "2026-02-18", amount: 1500, category: "investment", type: "income", description: "Stock Sale" },
  { id: "20", date: "2026-02-22", amount: 420, category: "healthcare", type: "expense", description: "Dental Checkup" },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [role, setRole] = useState<Role>("admin")
  const [filters, setFiltersState] = useState<FilterState>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  })

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      )
    }

    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type)
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category)
    }

    result.sort((a, b) => {
      if (filters.sortBy === "date") {
        return filters.sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        return filters.sortOrder === "desc"
          ? b.amount - a.amount
          : a.amount - b.amount
      }
    })

    return result
  }, [transactions, filters])

  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    }
  }, [transactions])

  const value = useMemo(
    () => ({
      transactions,
      role,
      filters,
      setRole,
      setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
      filteredTransactions,
      totalBalance,
      totalIncome,
      totalExpenses,
    }),
    [
      transactions,
      role,
      filters,
      setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
      filteredTransactions,
      totalBalance,
      totalIncome,
      totalExpenses,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

export const categoryConfig: Record<Category, { label: string; color: string }> = {
  salary: { label: "Salary", color: "var(--chart-1)" },
  freelance: { label: "Freelance", color: "var(--chart-2)" },
  investment: { label: "Investment", color: "var(--chart-3)" },
  food: { label: "Food & Dining", color: "var(--chart-4)" },
  transport: { label: "Transport", color: "var(--chart-5)" },
  shopping: { label: "Shopping", color: "var(--chart-1)" },
  entertainment: { label: "Entertainment", color: "var(--chart-2)" },
  utilities: { label: "Utilities", color: "var(--chart-3)" },
  healthcare: { label: "Healthcare", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
}
