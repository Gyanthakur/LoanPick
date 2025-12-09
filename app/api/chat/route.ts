

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]
  const userQuery = lastMessage.content.toLowerCase()

  // Supabase client
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  // Fetch all loan products
  const { data: loans } = await supabase
    .from("loan_products")
    .select("*")
    .order("interest_rate", { ascending: true })

  if (!loans || loans.length === 0) {
    return Response.json({ message: "No loan products available." })
  }

  // Utility function to calculate EMI
  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 1200
    return Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    )
  }

  // Filter and prepare response dynamically
  let filteredLoans: any[] = []
  if (userQuery.includes("home") || userQuery.includes("housing") || userQuery.includes("property")) {
    filteredLoans = loans.filter((l) => l.category === "Home Loan")
  } else if (userQuery.includes("personal") || userQuery.includes("emergency")) {
    filteredLoans = loans.filter((l) => l.category === "Personal Loan")
  } else if (userQuery.includes("business") || userQuery.includes("entrepreneur") || userQuery.includes("commercial")) {
    filteredLoans = loans.filter((l) => l.category === "Business Loan")
  } else if (userQuery.includes("education") || userQuery.includes("student") || userQuery.includes("study")) {
    filteredLoans = loans.filter((l) => l.category === "Education Loan")
  } else if (userQuery.includes("car") || userQuery.includes("vehicle") || userQuery.includes("auto")) {
    filteredLoans = loans.filter((l) => l.category === "Car Loan")
  } else if (userQuery.includes("lowest") || userQuery.includes("best rate")) {
    filteredLoans = loans.sort((a, b) => a.interest_rate - b.interest_rate).slice(0, 5)
  } else if (userQuery.includes("eligibility") || userQuery.includes("criteria") || userQuery.includes("qualify")) {
    filteredLoans = loans // all loans for eligibility
  }

  // Build detailed FAQ-style response
  let responseText = ""
  if (filteredLoans.length) {
    responseText += `**Here are your loan options:**\n\n`
    filteredLoans.slice(0, 5).forEach((loan, idx) => {
      const emi = calculateEMI(loan.max_loan_amount, loan.interest_rate, loan.loan_term_months)
      responseText += `**${idx + 1}. ${loan.product_name} (${loan.category})** - ${loan.bank_name}\n`
      responseText += `- Interest Rate: ${loan.interest_rate}% p.a.\n`
      responseText += `- Maximum Loan Amount: ₹${loan.max_loan_amount.toLocaleString()}\n`
      responseText += `- Loan Term: ${loan.loan_term_months} months\n`
      responseText += `- Estimated EMI: ₹${emi.toLocaleString()}/month\n`
      responseText += `- Features: ${loan.features.slice(0, 3).join(", ")}\n`
      responseText += `- Eligibility: ${loan.eligibility_criteria}\n`
      if (loan.faq?.length) {
        responseText += `- FAQs:\n`
        loan.faq.forEach((q: any) => {
          responseText += `   • Q: ${q.question} A: ${q.answer}\n`
        })
      }
      responseText += `\n`
    })
    responseText += `**Best Option:** ${filteredLoans[0].product_name} @ ${filteredLoans[0].interest_rate}%\n`
  } else {
    responseText = `
Welcome to LoanPicks AI Assistant!  
I can provide detailed information on all types of loans, including:  
• Home Loans  
• Personal Loans  
• Business Loans  
• Car Loans  
• Education Loans  

You can ask:  
- "Which loan has the lowest interest rate?"  
- "Compare home loans"  
- "Eligibility criteria for personal loans"  
- "EMI for ₹10 lakh car loan"  
`
  }

  // Send response through GROQ AI for friendly formatting
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) return Response.json({ error: "Groq API key missing" }, { status: 500 })

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are LoanPicks AI assistant. 
Rewrite the assistant message in a friendly, clear, FAQ style. 
Keep answers concise and accurate.`
        },
        { role: "user", content: responseText }
      ],
      temperature: 0.6,
      max_tokens: 400
    })
  })

  const aiData = await groqRes.json()
  const finalMessage = aiData?.choices?.[0]?.message?.content || responseText

  return Response.json({
    message: finalMessage,
    timestamp: new Date().toISOString(),
  })
}
