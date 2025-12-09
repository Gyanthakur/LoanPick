
"use client";

import React, { useState } from "react";
import type { LoanProduct } from "@/lib/types";
import { submitLoanApplication } from "@/app/actions";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface LoanApplicationModalProps {
  loan: LoanProduct;
  trigger?: React.ReactNode;
}

export function LoanApplicationModal({ loan, trigger }: LoanApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employmentStatus: "",
    monthlyIncome: "",
    loanAmount: "",
    purpose: "",
    agreedToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitLoanApplication({
        loanProductId: loan.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        employmentStatus: formData.employmentStatus,
        monthlyIncome: Number.parseFloat(formData.monthlyIncome),
        loanAmount: Number.parseFloat(formData.loanAmount),
        loanPurpose: formData.purpose,
      });

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            employmentStatus: "",
            monthlyIncome: "",
            loanAmount: "",
            purpose: "",
            agreedToTerms: false,
          });
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(result.error || "Failed to submit application");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)} className="w-full">
        {trigger || (
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Apply Now
          </button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 rounded-lg p-6 shadow-lg">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">Apply for {loan.product_name}</h2>
                  <p className="text-gray-500">
                    {loan.bank_name} • {loan.interest_rate}% interest rate
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="block text-sm font-medium">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & Employment Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="employmentStatus" className="block text-sm font-medium">
                        Employment Status *
                      </label>
                      <select
                        id="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={(e) =>
                          setFormData({ ...formData, employmentStatus: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select status</option>
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business">Business Owner</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  {/* Monthly Income & Loan Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="monthlyIncome" className="block text-sm font-medium">
                        Monthly Income (₹) *
                      </label>
                      <input
                        id="monthlyIncome"
                        type="number"
                        required
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                        placeholder="50000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="loanAmount" className="block text-sm font-medium">
                        Desired Loan Amount (₹) *
                      </label>
                      <input
                        id="loanAmount"
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                        placeholder="100000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Loan Purpose */}
                  <div className="space-y-1">
                    <label htmlFor="purpose" className="block text-sm font-medium">
                      Loan Purpose *
                    </label>
                    <textarea
                      id="purpose"
                      required
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Please describe how you plan to use this loan..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreedToTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreedToTerms: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                      I agree to the terms and conditions and authorize {loan.bank_name} to contact
                      me regarding this loan application.
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.agreedToTerms || isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">Application Submitted!</h2>
                <p className="text-center text-gray-500 max-w-md">
                  Thank you for applying. {loan.bank_name} will review your application and contact
                  you within 24-48 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
