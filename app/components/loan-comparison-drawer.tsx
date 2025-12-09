"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import type { LoanProduct } from "@/lib/types"
import { TrendingDown, Calendar, DollarSign, Building2, X, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface LoanComparisonDrawerProps {
  trigger?: React.ReactNode
}

export function LoanComparisonDrawer({ trigger }: LoanComparisonDrawerProps) {
  const [open, setOpen] = useState(false)
  const [compareList, setCompareList] = useState<LoanProduct[]>([])

  useEffect(() => {
    // Load comparison list from localStorage
    const stored = localStorage.getItem("loanCompareList")
    if (stored) {
      try {
        setCompareList(JSON.parse(stored))
      } catch (e) {
        console.error("[v0] Error parsing comparison list:", e)
      }
    }

    // Listen for storage events to sync across tabs/components
    const handleStorageChange = () => {
      const stored = localStorage.getItem("loanCompareList")
      if (stored) {
        try {
          setCompareList(JSON.parse(stored))
        } catch (e) {
          console.error("[v0] Error parsing comparison list:", e)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom event for same-tab updates
    window.addEventListener("compareListUpdated" as any, handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("compareListUpdated" as any, handleStorageChange)
    }
  }, [])

  // const removeFromComparison = (loanId: number) => {
  //   const updated = compareList.filter((loan) => loan.id !== loanId)
  //   setCompareList(updated)
  //   localStorage.setItem("loanCompareList", JSON.stringify(updated))
  //   window.dispatchEvent(new Event("compareListUpdated"))
  // }
const removeFromComparison = (loanId: number | string) => {
  const updated = compareList.filter((loan) => String(loan.id) !== String(loanId))
  setCompareList(updated)
  localStorage.setItem("loanCompareList", JSON.stringify(updated))
  window.dispatchEvent(new Event("compareListUpdated"))
}

  const clearAll = () => {
    setCompareList([])
    localStorage.removeItem("loanCompareList")
    window.dispatchEvent(new Event("compareListUpdated"))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTerm = (months: number) => {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`
    } else if (years > 0) {
      return `${years} years`
    }
    return `${months} months`
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <Scale className="h-4 w-4" />
            Compare Loans
            {compareList.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {compareList.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Compare Loans
          </SheetTitle>
          <SheetDescription>
            {compareList.length === 0
              ? "Add loans to compare their features side-by-side"
              : `Comparing ${compareList.length} loan${compareList.length > 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {compareList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Scale className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No loans added for comparison yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the "Compare" button on any loan card to add it here.
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              {/* Comparison Cards */}
              {compareList.map((loan) => (
                <Card key={loan.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeFromComparison(loan.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <div className="flex items-start gap-3 pr-8">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{loan.product_name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{loan.bank_name}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingDown className="h-3 w-3" />
                          <span>Interest Rate</span>
                        </div>
                        <p className="text-xl font-bold text-primary">{loan.interest_rate}%</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>Max Amount</span>
                        </div>
                        <p className="text-sm font-semibold">{formatCurrency(loan.max_loan_amount)}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Loan Term</span>
                      </div>
                      <p className="text-sm font-medium">{formatTerm(loan.loan_term_months)}</p>
                    </div>

                    {loan.features && loan.features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {loan.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {loan.eligibility_criteria && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Eligibility:</span> {loan.eligibility_criteria}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Summary Comparison Table */}
              {compareList.length > 1 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium">Lowest Interest Rate:</span>
                      <span className="text-sm font-bold text-primary">
                        {Math.min(...compareList.map((l) => l.interest_rate))}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium">Highest Loan Amount:</span>
                      <span className="text-sm font-bold">
                        {formatCurrency(Math.max(...compareList.map((l) => l.max_loan_amount)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Longest Term:</span>
                      <span className="text-sm font-bold">
                        {formatTerm(Math.max(...compareList.map((l) => l.loan_term_months)))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
