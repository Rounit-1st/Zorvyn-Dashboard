"use client"

import { RoleSwitcher } from "./role-switcher"
import { Wallet } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary p-2">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">FinanceHub</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Personal Finance Dashboard</p>
          </div>
        </div>
        <RoleSwitcher />
      </div>
    </header>
  )
}
