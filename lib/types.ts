export interface LoanProduct {
  id: string
  product_name: string
  bank_name: string
  interest_rate: number
  max_loan_amount: number
  loan_term_months: number
  eligibility_criteria: string | null
  features: string[]
  created_at: string
  updated_at: string
  // New fields
  loan_type?:
    | "personal"
    | "education"
    | "vehicle"
    | "home"
    | "credit_line"
    | "debt_consolidation"
    | "business"
    | "gold"
    | "property"
  rate_apr?: number
  min_income?: number
  min_credit_score?: number
  tenure_min_months?: number
  tenure_max_months?: number
  processing_fee_pct?: number
  prepayment_allowed?: boolean
  disbursal_speed?: "fast" | "standard" | "slow"
  docs_level?: "low" | "standard" | "high"
  summary?: string
  faq?: Array<{ question: string; answer: string }>
  terms?: Record<string, any>
}

export interface FilterOptions {
  bankName?: string
  minInterestRate?: number
  maxInterestRate?: number
  minLoanAmount?: number
  maxLoanAmount?: number
  loanTermMonths?: number
}

export interface LoanApplication {
  id: string
  user_id: string
  loan_product_id: string | null
  full_name: string
  email: string
  phone: string
  date_of_birth: string | null
  employment_status: string
  employer_name: string | null
  monthly_income: number | null
  loan_amount: number
  loan_purpose: string
  status: "pending" | "approved" | "rejected" | "under_review"
  created_at: string
  updated_at: string
  loan_product?: LoanProduct
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export interface ProductChatRequest {
  productId: string
  message: string
  history: ChatMessage[]
}

export interface ProductChatResponse {
  message: string
  error?: string
}
