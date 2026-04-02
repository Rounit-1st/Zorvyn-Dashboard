"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStore, type Role } from "@/lib/store"
import { Shield, Eye } from "lucide-react"

export function RoleSwitcher() {
  const { role, setRole } = useStore()

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {role === "admin" ? (
          <Shield className="h-4 w-4 text-primary" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground hidden sm:inline">Role:</span>
      </div>
      <Select value={role} onValueChange={(value: Role) => setRole(value)}>
        <SelectTrigger className="w-[120px] bg-input border-border text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </div>
          </SelectItem>
          <SelectItem value="viewer">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Viewer
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Badge
        variant={role === "admin" ? "default" : "secondary"}
        className={
          role === "admin"
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "bg-muted text-muted-foreground"
        }
      >
        {role === "admin" ? "Full Access" : "View Only"}
      </Badge>
    </div>
  )
}
