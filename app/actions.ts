"use server"

import { createClient } from "@/lib/supabase/server"
import type { FilterOptions, LoanApplication } from "@/lib/types"

export async function getTopLoans(limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("loan_products")
    .select("*")
    .order("interest_rate", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching top loans:", error)
    return []
  }

  return data || []
}

export async function getAllLoans(filters?: FilterOptions) {
  const supabase = await createClient()

  let query = supabase.from("loan_products").select("*")

  if (filters?.bankName) {
    query = query.ilike("bank_name", `%${filters.bankName}%`)
  }

  if (filters?.minInterestRate !== undefined) {
    query = query.gte("interest_rate", filters.minInterestRate)
  }

  if (filters?.maxInterestRate !== undefined) {
    query = query.lte("interest_rate", filters.maxInterestRate)
  }

  if (filters?.minLoanAmount !== undefined) {
    query = query.gte("max_loan_amount", filters.minLoanAmount)
  }

  if (filters?.maxLoanAmount !== undefined) {
    query = query.lte("max_loan_amount", filters.maxLoanAmount)
  }

  if (filters?.loanTermMonths !== undefined) {
    query = query.eq("loan_term_months", filters.loanTermMonths)
  }

  query = query.order("interest_rate", { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching all loans:", error)
    return []
  }

  return data || []
}

export async function submitLoanApplication(applicationData: {
  loanProductId: string
  fullName: string
  email: string
  phone: string
  employmentStatus: string
  monthlyIncome: number
  loanAmount: number
  loanPurpose: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from("loan_applications")
    .insert({
      user_id: user.id,
      loan_product_id: applicationData.loanProductId,
      full_name: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      employment_status: applicationData.employmentStatus,
      monthly_income: applicationData.monthlyIncome,
      loan_amount: applicationData.loanAmount,
      loan_purpose: applicationData.loanPurpose,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error submitting loan application:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getUserApplications(): Promise<LoanApplication[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("loan_applications")
    .select(
      `
      *,
      loan_product:loan_products(*)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching user applications:", error)
    return []
  }

  return data || []
}
