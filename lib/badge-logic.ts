// import type { LoanProduct } from "./types"
import type { LoanProduct } from "./types"

export interface BadgeConfig {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon?: string
}

export function generateDynamicBadges(loan: LoanProduct): BadgeConfig[] {
  const badges: BadgeConfig[] = []

  // Low APR badge
  if (loan.rate_apr && loan.rate_apr < 9) {
    badges.push({
      label: "Low APR",
      variant: "default",
    })
  }

  // No Prepayment badge
  if (loan.prepayment_allowed) {
    badges.push({
      label: "No Prepayment Penalty",
      variant: "secondary",
    })
  }

  // Fast Disbursal badge
  if (loan.disbursal_speed === "fast") {
    badges.push({
      label: "Fast Disbursal",
      variant: "default",
    })
  }

  // Flexible Tenure badge
  if (loan.tenure_max_months && loan.tenure_max_months >= 120) {
    badges.push({
      label: "Flexible Tenure",
      variant: "secondary",
    })
  }

  // Low Docs badge
  if (loan.docs_level === "low") {
    badges.push({
      label: "Low Documentation",
      variant: "outline",
    })
  }

  // Minimum Income badge
  if (loan.min_income) {
    badges.push({
      label: `Salary > ₹${(loan.min_income / 1000).toFixed(0)}K`,
      variant: "outline",
    })
  }

  // Credit Score badge
  if (loan.min_credit_score) {
    badges.push({
      label: `Credit Score ≥ ${loan.min_credit_score}`,
      variant: "outline",
    })
  }

  // Processing Fee badge
  if (loan.processing_fee_pct !== undefined && loan.processing_fee_pct < 1) {
    badges.push({
      label: "Low Processing Fee",
      variant: "secondary",
    })
  }

  // High Loan Amount badge
  if (loan.max_loan_amount >= 10000000) {
    badges.push({
      label: "High Loan Amount",
      variant: "default",
    })
  }

  // Limited Time Offer (random for demo)
  if (Math.random() > 0.7) {
    badges.push({
      label: "Limited-Time Offer",
      variant: "destructive",
    })
  }

  // Return at least 3 badges, prioritizing the most important ones
  return badges.slice(0, 6)
}
