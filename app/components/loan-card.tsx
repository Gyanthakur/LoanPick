"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "./ui/card";


import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { TrendingDown, Calendar, DollarSign, Building2, MessageCircle } from "lucide-react"
import type { LoanProduct } from "@/lib/types"
import { LoanApplicationModal } from "./loan-application-modal"
import { ProductChatSheet } from "./product-chat-sheet"
import { useState, useEffect } from "react"
import { generateDynamicBadges } from "@/lib/badge-logic"

interface LoanCardProps {
  loan: LoanProduct
  rank?: number
  showRank?: boolean
}

export function LoanCard({ loan, rank, showRank = false }: LoanCardProps) {
  const [isInCompareList, setIsInCompareList] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const badges = generateDynamicBadges(loan)

  useEffect(() => {
    // Check if loan is already in compare list
    const stored = localStorage.getItem("loanCompareList")
    if (stored) {
      try {
        const compareList = JSON.parse(stored)
        setIsInCompareList(compareList.some((l: LoanProduct) => l.id === loan.id))
      } catch (e) {
        console.error("[v0] Error checking compare list:", e)
      }
    }

    // Listen for updates
    const handleUpdate = () => {
      const stored = localStorage.getItem("loanCompareList")
      if (stored) {
        try {
          const compareList = JSON.parse(stored)
          setIsInCompareList(compareList.some((l: LoanProduct) => l.id === loan.id))
        } catch (e) {
          console.error("[v0] Error checking compare list:", e)
        }
      } else {
        setIsInCompareList(false)
      }
    }

    window.addEventListener("compareListUpdated" as any, handleUpdate)
    return () => window.removeEventListener("compareListUpdated" as any, handleUpdate)
  }, [loan.id])

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

  const handleCompare = () => {
    const stored = localStorage.getItem("loanCompareList")
    let compareList: LoanProduct[] = []

    if (stored) {
      try {
        compareList = JSON.parse(stored)
      } catch (e) {
        console.error("[v0] Error parsing compare list:", e)
      }
    }

    const isAlreadyInList = compareList.some((l) => l.id === loan.id)

    if (isAlreadyInList) {
      // Remove from list
      compareList = compareList.filter((l) => l.id !== loan.id)
    } else {
      // Add to list (max 4 loans)
      if (compareList.length >= 4) {
        alert("You can compare up to 4 loans at a time. Please remove one to add another.")
        return
      }
      compareList.push(loan)
    }

    localStorage.setItem("loanCompareList", JSON.stringify(compareList))
    window.dispatchEvent(new Event("compareListUpdated"))
    setIsInCompareList(!isAlreadyInList)
  }

  return (
    <>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        {showRank && rank && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="text-lg font-bold">
              #{rank}
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{loan.product_name}</CardTitle>
              <CardDescription className="text-base mt-1">{loan.bank_name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 4).map((badge, index) => (
              <Badge key={index} variant={badge.variant} className="text-xs">
                {badge.label}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span>Interest Rate</span>
              </div>
              <p className="text-2xl font-bold text-primary">{loan.rate_apr || loan.interest_rate}%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Max Amount</span>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(loan.max_loan_amount)}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Loan Term</span>
            </div>
            <p className="font-medium">{formatTerm(loan.loan_term_months)}</p>
          </div>

          {loan.summary && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">{loan.summary}</p>
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
        <CardFooter className="gap-2 flex-wrap">
          <LoanApplicationModal loan={loan} trigger={<Button className="flex-1 min-w-[120px]">Apply Now</Button>} />
          <Button
            variant={isInCompareList ? "default" : "outline"}
            className="flex-1 min-w-[120px]"
            onClick={handleCompare}
          >
            {isInCompareList ? "Added" : "Compare"}
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setChatOpen(true)}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask About Product
          </Button>
        </CardFooter>
      </Card>

      <ProductChatSheet loan={loan} open={chatOpen} onOpenChange={setChatOpen} />
    </>
  )
}
