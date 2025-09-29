"use client"

import * as React from "react"

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <button type="button">{children}</button>
}

export function DropdownMenuContent({ children, align = "end", className = "" }: { children: React.ReactNode; align?: "start" | "end"; className?: string }) {
  return <div className={className}>{children}</div>
}

export function DropdownMenuItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuSeparator() {
  return <div />
}


