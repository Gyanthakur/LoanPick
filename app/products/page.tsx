"use client"

import { useState, useEffect } from "react"
import { LoanCard } from "../components/loan-card"
import { ProductFilters } from "../components/product-filters"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Search,
  SlidersHorizontal,
  MessageSquare,
  Sparkles,
  LogIn,
  UserPlus,
  Scale,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { LoanProduct } from "@/lib/types"
import { LoanComparisonDrawer } from "../components/loan-comparison-drawer"

function ClientNavigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) return null

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">LoanPicks</h1>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
            <LoanComparisonDrawer
              trigger={
                <Button variant="ghost">
                  <Scale className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              }
            />

            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                <form action="/auth/logout" method="post">
                  <Button type="submit" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default function ProductsPage() {
  const [loans, setLoans] = useState<LoanProduct[]>([])
  const [filteredLoans, setFilteredLoans] = useState<LoanProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("loan_products").select("*").order("interest_rate", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching loans:", error)
      setLoading(false)
      return
    }

    setLoans(data || [])
    setFilteredLoans(data || [])
    setLoading(false)
  }

  const handleFilterChange = (filters: any) => {
    let filtered = [...loans]

    if (filters.bankName) {
      filtered = filtered.filter((loan) => loan.bank_name.toLowerCase().includes(filters.bankName.toLowerCase()))
    }

    if (filters.minInterestRate !== undefined) {
      filtered = filtered.filter((loan) => loan.interest_rate >= filters.minInterestRate)
    }

    if (filters.maxInterestRate !== undefined) {
      filtered = filtered.filter((loan) => loan.interest_rate <= filters.maxInterestRate)
    }

    if (filters.minLoanAmount > 0) {
      filtered = filtered.filter((loan) => loan.max_loan_amount >= filters.minLoanAmount)
    }

    if (filters.maxLoanAmount > 0 && filters.maxLoanAmount < 50000000) {
      filtered = filtered.filter((loan) => loan.max_loan_amount <= filters.maxLoanAmount)
    }

    if (filters.loanTermMonths && filters.loanTermMonths !== "") {
      filtered = filtered.filter((loan) => loan.loan_term_months === Number(filters.loanTermMonths))
    }

    setFilteredLoans(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredLoans(loans)
      return
    }

    const searched = loans.filter(
      (loan) =>
        loan.product_name.toLowerCase().includes(query.toLowerCase()) ||
        loan.bank_name.toLowerCase().includes(query.toLowerCase()) ||
        loan.features.some((feature) => feature.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredLoans(searched)
  }

  const handleReset = () => {
    setFilteredLoans(loans)
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ClientNavigation />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">All Loan Products</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Browse and compare {loans.length} loan products from top banks
          </p>
        </div>

        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by product name, bank, or features..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-background w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <ProductFilters onFilterChange={handleFilterChange} onReset={handleReset} />
            </div>
          )}

          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Loading loan products...</p>
                </div>
              </div>
            ) : filteredLoans.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <p className="text-2xl font-semibold">No loans found</p>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                  <Button onClick={handleReset}>Reset Filters</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredLoans.length} of {loans.length} products
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredLoans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
