-- Create loan applications table to track user loan applications
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  loan_product_id UUID REFERENCES loan_products(id),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  
  -- Employment Information
  employment_status TEXT NOT NULL,
  employer_name TEXT,
  monthly_income DECIMAL(15, 2),
  
  -- Loan Details
  loan_amount DECIMAL(15, 2) NOT NULL,
  loan_purpose TEXT NOT NULL,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, under_review
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON loan_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create own applications"
  ON loan_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
  ON loan_applications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
