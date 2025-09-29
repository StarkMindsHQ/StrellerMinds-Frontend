"use client"

import * as React from "react"

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SheetTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <button type="button">{children}</button>
}

export function SheetContent({ children, side = "left", className = "" }: { children: React.ReactNode; side?: "left" | "right" | "top" | "bottom"; className?: string }) {
  return <div className={className}>{children}</div>
}


