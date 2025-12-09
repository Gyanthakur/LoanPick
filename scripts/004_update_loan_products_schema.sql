-- Add new columns to loan_products table for enhanced features
ALTER TABLE loan_products 
ADD COLUMN IF NOT EXISTS loan_type TEXT CHECK (loan_type IN ('personal','education','vehicle','home','credit_line','debt_consolidation','business','gold','property')),
ADD COLUMN IF NOT EXISTS rate_apr DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS min_income DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS min_credit_score INTEGER,
ADD COLUMN IF NOT EXISTS tenure_min_months INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS tenure_max_months INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS processing_fee_pct DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS prepayment_allowed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS disbursal_speed TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS docs_level TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS terms JSONB DEFAULT '{}';

-- Update existing records with new data
UPDATE loan_products SET
  loan_type = CASE 
    WHEN product_name LIKE '%Home%' OR product_name LIKE '%Property%' THEN 'home'
    WHEN product_name LIKE '%Personal%' THEN 'personal'
    WHEN product_name LIKE '%Car%' OR product_name LIKE '%Two Wheeler%' THEN 'vehicle'
    WHEN product_name LIKE '%Business%' OR product_name LIKE '%Startup%' THEN 'business'
    WHEN product_name LIKE '%Education%' THEN 'education'
    WHEN product_name LIKE '%Gold%' THEN 'gold'
    WHEN product_name LIKE '%Property%' THEN 'property'
    ELSE 'personal'
  END,
  rate_apr = interest_rate,
  min_income = CASE 
    WHEN eligibility_criteria LIKE '%50,000%' THEN 50000
    WHEN eligibility_criteria LIKE '%35,000%' THEN 35000
    WHEN eligibility_criteria LIKE '%30,000%' THEN 30000
    WHEN eligibility_criteria LIKE '%25,000%' THEN 25000
    ELSE 20000
  END,
  min_credit_score = CASE 
    WHEN eligibility_criteria LIKE '%720%' THEN 720
    WHEN eligibility_criteria LIKE '%700%' THEN 700
    WHEN eligibility_criteria LIKE '%650%' THEN 650
    ELSE 600
  END,
  tenure_min_months = 6,
  tenure_max_months = loan_term_months,
  processing_fee_pct = 1.0,
  prepayment_allowed = CASE WHEN 'No prepayment charges' = ANY(features) THEN TRUE ELSE FALSE END,
  disbursal_speed = CASE WHEN 'Quick approval' = ANY(features) OR 'Instant approval' = ANY(features) THEN 'fast' ELSE 'standard' END,
  docs_level = CASE WHEN 'Minimal documentation' = ANY(features) THEN 'low' ELSE 'standard' END,
  summary = 'Get the best loan rates with quick approval and flexible repayment options.',
  faq = '[
    {"question": "What documents are required?", "answer": "Valid ID proof, address proof, income proof, and bank statements for the last 6 months."},
    {"question": "How long does approval take?", "answer": "Typically 24-48 hours for document verification and approval."},
    {"question": "Can I prepay the loan?", "answer": "Yes, prepayment is allowed with minimal or no charges."},
    {"question": "What is the minimum credit score required?", "answer": "The minimum credit score varies by product, typically ranging from 600-720."}
  ]'::jsonb,
  terms = '{"late_payment_fee": "2% of overdue amount", "bounce_charges": "₹500 per bounce"}'::jsonb
WHERE loan_type IS NULL;

-- Create ai_chat_messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_id UUID REFERENCES loan_products(id),
  role TEXT CHECK (role IN ('user','assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for ai_chat_messages
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON ai_chat_messages
  FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create chat messages"
  ON ai_chat_messages
  FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_product_id ON ai_chat_messages(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
