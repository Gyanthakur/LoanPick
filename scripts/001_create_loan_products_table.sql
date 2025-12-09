-- Create loan_products table
CREATE TABLE IF NOT EXISTS loan_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  max_loan_amount DECIMAL(15, 2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  eligibility_criteria TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_loan_products_bank_name ON loan_products(bank_name);
CREATE INDEX IF NOT EXISTS idx_loan_products_interest_rate ON loan_products(interest_rate);

-- Insert sample loan products data
INSERT INTO loan_products (product_name, bank_name, interest_rate, max_loan_amount, loan_term_months, eligibility_criteria, features) VALUES
('Home Loan Pro', 'State Bank', 6.75, 50000000, 240, 'Minimum salary: $50,000, Credit score: 700+', ARRAY['Zero processing fee', 'Quick approval in 48 hours', 'Flexible repayment options', 'No prepayment charges']),
('Personal Loan Plus', 'HDFC Bank', 10.50, 2500000, 60, 'Minimum salary: $30,000, Credit score: 650+', ARRAY['Instant approval', 'No collateral required', 'Doorstep service', 'Competitive rates']),
('Car Loan Express', 'ICICI Bank', 8.25, 2000000, 84, 'Minimum salary: $35,000, Valid driving license', ARRAY['Up to 90% financing', 'Easy documentation', 'Free insurance', 'Quick disbursal']),
('Business Loan Elite', 'Axis Bank', 11.00, 10000000, 120, 'Business vintage: 3 years, Annual turnover: $500,000+', ARRAY['No hidden charges', 'Working capital support', 'Overdraft facility', 'Business advisory']),
('Education Loan Smart', 'Punjab National Bank', 7.50, 7500000, 180, 'Admission to recognized institution, Co-applicant required', ARRAY['Moratorium period available', 'Covers tuition and living expenses', 'Tax benefits', 'Flexible repayment']),
('Gold Loan Instant', 'Kotak Mahindra Bank', 9.00, 5000000, 12, 'Gold purity: 18-22 carat, Valid ID proof', ARRAY['Same day approval', 'No credit score check', 'Minimal documentation', 'Overdraft option']),
('Property Loan Premium', 'Yes Bank', 8.75, 30000000, 240, 'Property value assessment, Credit score: 720+', ARRAY['Balance transfer facility', 'Top-up loan available', 'Negotiable ROI', 'Part payment allowed']),
('Startup Loan Venture', 'IndusInd Bank', 12.50, 5000000, 60, 'Business plan required, Collateral may be needed', ARRAY['Mentorship program', 'Networking opportunities', 'Grace period', 'Customized solutions']),
('Medical Loan Care', 'Federal Bank', 10.00, 1000000, 36, 'Medical bills required, Co-applicant preferred', ARRAY['Fast processing', 'Cashless facility at partner hospitals', 'No prepayment penalty', 'Insurance coverage']),
('Wedding Loan Celebration', 'Bank of Baroda', 11.75, 1500000, 48, 'Minimum salary: $25,000, Wedding proof', ARRAY['Attractive interest rates', 'Quick approval', 'Flexible tenure', 'Minimal documentation']),
('Home Renovation Loan', 'Canara Bank', 9.25, 2000000, 72, 'Property ownership proof, Income proof', ARRAY['Easy approval process', 'Competitive rates', 'End-use flexibility', 'No collateral for amounts under $100,000']),
('Two Wheeler Loan', 'Union Bank', 12.00, 150000, 36, 'Age: 21-65 years, Stable income', ARRAY['100% financing available', 'Quick disbursal', 'Flexible EMI options', 'Free insurance first year']),
('Solar Loan Green', 'Indian Bank', 7.00, 3000000, 180, 'Property ownership, Solar vendor quotation', ARRAY['Subsidy benefits', 'Long tenure', 'Environment friendly', 'Low interest rate']),
('Loan Against Securities', 'IDBI Bank', 9.50, 10000000, 60, 'Demat account, Valid securities', ARRAY['Continue earning on investments', 'Overdraft facility', 'Quick approval', 'Flexible repayment']),
('Agricultural Loan', 'Bank of India', 6.50, 5000000, 120, 'Land ownership, Farming experience', ARRAY['Interest subvention', 'Crop insurance', 'Flexible repayment', 'Government support']);

-- Create user_preferences table for personalization
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  preferred_loan_types TEXT[] DEFAULT '{}',
  max_interest_rate DECIMAL(5, 2),
  preferred_loan_term_months INTEGER,
  saved_products UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for loan_products (public read access)
CREATE POLICY "Allow public read access to loan products"
ON loan_products FOR SELECT
TO anon, authenticated
USING (true);

-- Create policies for user_preferences (users can only access their own data)
CREATE POLICY "Users can view their own preferences"
ON user_preferences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON user_preferences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON user_preferences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
