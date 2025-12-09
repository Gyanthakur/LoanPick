

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { LoanProduct, ProductChatRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: ProductChatRequest = await request.json();
    const { productId, message, history } = body;

    if (!productId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch product
    const supabase = await createServerClient();
    const { data: product, error } = await supabase
      .from("loan_products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const loanProduct = product as LoanProduct;

    const productContext = `
You are a helpful loan advisor assistant. Use ONLY these product details:

Product Name: ${loanProduct.product_name}
Bank: ${loanProduct.bank_name}
Loan Type: ${loanProduct.loan_type}
Interest Rate: ${loanProduct.interest_rate}%
Max Amount: ₹${loanProduct.max_loan_amount?.toLocaleString("en-IN")}
Term: ${loanProduct.loan_term_months} months
Minimum Income: ₹${loanProduct.min_income?.toLocaleString("en-IN")}
Credit Score: ${loanProduct.min_credit_score}
Processing Fee: ${loanProduct.processing_fee_pct}%
Features: ${loanProduct.features?.join(", ")}

Instructions:
- Answer only using above details.
- If data not available, say: "This info is not available for this loan product."
- Keep replies short: 2–4 sentences.
`;

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "GROQ API key missing" }, { status: 500 });
    }

    // ✅ FIX: Clean history (remove timestamp, id, created_at, etc.)
    // const cleanedHistory = (history || []).map((msg) => {
    //   const { timestamp, id, created_at, ...rest } = msg;
    //   return rest;
    // });

    const cleanedHistory = (history || []).map((msg) => {
  const { timestamp, id, created_at, ...rest } = msg as any; // bypass TS error
  return rest;
});

    const messages = [
      { role: "system", content: productContext },
      ...cleanedHistory,
      { role: "user", content: message },
    ];

    // Call Groq
    const aiResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.7,
          max_tokens: 400,
        }),
      }
    );

    if (!aiResponse.ok) {
      const err = await aiResponse.json();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await aiResponse.json();
    const assistantMessage =
      data.choices?.[0]?.message?.content || "No response";

    // Save chat
    try {
      await supabase.from("ai_chat_messages").insert({
        product_id: productId,
        role: "user",
        content: message,
      });

      await supabase.from("ai_chat_messages").insert({
        product_id: productId,
        role: "assistant",
        content: assistantMessage,
      });
    } catch (err) {
      console.error("DB save error:", err);
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
