

"use client";

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { X } from "lucide-react"

interface FilterState {
  bankName: string
  minInterestRate: number
  maxInterestRate: number
  minLoanAmount: number
  maxLoanAmount: number
  loanTermMonths: string
}

interface ProductFiltersProps {
  onFilterChange: (filters: Partial<FilterState>) => void
  onReset: () => void
}

export function ProductFilters({ onFilterChange, onReset }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    bankName: "",
    minInterestRate: 0,
    maxInterestRate: 20,
    minLoanAmount: 0,
    maxLoanAmount: 50000000,
    loanTermMonths: "all",
  })

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleInterestRateChange = (values: number[]) => {
    const newFilters = { ...filters, minInterestRate: values[0], maxInterestRate: values[1] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      bankName: "",
      minInterestRate: 0,
      maxInterestRate: 20,
      minLoanAmount: 0,
      maxLoanAmount: 50000000,
      loanTermMonths: "all",
    }
    setFilters(resetFilters)
    onReset()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* BANK NAME */}
        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            placeholder="Search by bank..."
            value={filters.bankName}
            onChange={(e) => handleFilterChange("bankName", e.target.value)}
          />
        </div>

        {/* INTEREST RATE SLIDER */}
        <div className="space-y-4">
          <Label>
            Interest Rate: {filters.minInterestRate}% - {filters.maxInterestRate}%
          </Label>

          <Slider
            min={0}
            max={20}
            step={0.25}
            value={[filters.minInterestRate, filters.maxInterestRate]}
            onValueChange={handleInterestRateChange}
          />
        </div>

        {/* MIN LOAN */}
        <div className="space-y-2">
          <Label htmlFor="min-loan-amount">Minimum Loan Amount</Label>
          <Input
            id="min-loan-amount"
            type="number"
            placeholder="0"
            value={filters.minLoanAmount || ""}
            onChange={(e) => handleFilterChange("minLoanAmount", Number(e.target.value))}
          />
        </div>

        {/* MAX LOAN */}
        <div className="space-y-2">
          <Label htmlFor="max-loan-amount">Maximum Loan Amount</Label>
          <Input
            id="max-loan-amount"
            type="number"
            placeholder="50000000"
            value={filters.maxLoanAmount || ""}
            onChange={(e) => handleFilterChange("maxLoanAmount", Number(e.target.value))}
          />
        </div>

        {/* LOAN TERM SELECT */}
        <div className="space-y-2">
          <Label id="loan-term-label">Loan Term</Label>

          <Select
            value={filters.loanTermMonths}
            onValueChange={(value) => handleFilterChange("loanTermMonths", value)}
            // name="loan-term"
            aria-labelledby="loan-term-label"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="12">1 Year</SelectItem>
              <SelectItem value="24">2 Years</SelectItem>
              <SelectItem value="36">3 Years</SelectItem>
              <SelectItem value="48">4 Years</SelectItem>
              <SelectItem value="60">5 Years</SelectItem>
              <SelectItem value="72">6 Years</SelectItem>
              <SelectItem value="84">7 Years</SelectItem>
              <SelectItem value="120">10 Years</SelectItem>
              <SelectItem value="180">15 Years</SelectItem>
              <SelectItem value="240">20 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  )
}
