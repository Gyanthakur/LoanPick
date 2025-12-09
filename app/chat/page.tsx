"use client"

import type React from "react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Sparkles, Send, Bot, UserIcon, Scale, LogIn, UserPlus, LayoutDashboard, LogOut, MessageSquare, Menu } from "lucide-react"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { LoanComparisonDrawer } from "../components/loan-comparison-drawer"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "../components/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions = [
    "What's the best home loan available?",
    "I need a personal loan of ₹500,000.",
    "Which bank offers the lowest interest rate?",
    "Eligibility criteria for business loans?",
  ]

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
  }

const handleSendMessage = async (text: string) => {
  if (!text.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: text,
  };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setIsLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Use the latest messages including the new one
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) throw new Error("Failed to get response");

    const data = await response.json();

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: data.message,
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
  } catch (error) {
    console.error("Chat error:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input?.trim()) return
    handleSendMessage(input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted/20">
      <ClientNavigation />
      {/* <Navigation/> */}

      <div className="flex-1 container mx-auto px-4 py-4 md:py-6 flex flex-col max-w-4xl overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 md:mb-6 space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-screen space-y-6 md:space-y-8 px-4">
              <div className="text-center space-y-3 md:space-y-4">
                <div className="inline-flex p-4 md:p-6 bg-primary/10 rounded-full">
                  <Bot className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">AI Loan Assistant</h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-md">
                  Ask me anything about loans, interest rates, eligibility, or get personalized recommendations
                </p>
              </div>

              <div className="w-full max-w-2xl space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto py-2 md:py-3 px-3 md:px-4 bg-card hover:bg-accent text-sm md:text-base"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                  )}
                  <Card
                    className={`px-3 py-2 md:px-4 md:py-3 max-w-[85%] md:max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap m-0 text-sm md:text-base leading-relaxed">{message.content}</p>
                    </div>
                  </Card>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center">
                      <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 md:gap-3 justify-start">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <Card className="px-3 py-2 md:px-4 md:py-3 bg-card">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t pt-3 md:pt-4 bg-background">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about loans, rates, or eligibility..."
              className="flex-1 text-sm md:text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input?.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Responses are for informational purposes only. Always verify details with the bank.
          </p>
        </div>
      </div>
    </div>
  )
}

// function ClientNavigation() {
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const checkUser = async () => {
//       const supabase = createClient()
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()
//       setUser(user)
//       setLoading(false)
//     }
//     checkUser()
//   }, [])

//   if (loading) return null

//   return (
//     <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <Sparkles className="h-6 w-6 text-primary" />
//             <h1 className="text-2xl font-bold">LoanPicks</h1>
//           </Link>
//           <nav className="flex items-center gap-3">
//             <Link href="/">
//               <Button variant="ghost">Home</Button>
//             </Link>
//             <Link href="/products">
//               <Button variant="ghost">All Products</Button>
//             </Link>
//             <LoanComparisonDrawer
//               trigger={
//                 <Button variant="ghost">
//                   <Scale className="h-4 w-4 mr-2" />
//                   Compare
//                 </Button>
//               }
//             />

//             {user ? (
//               <>
//                 <Link href="/dashboard">
//                   <Button variant="outline" className="gap-2 bg-transparent">
//                     <LayoutDashboard className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//                 <Link href="/profile">
//                   <Button variant="outline" className="gap-2 bg-transparent">
//                     <UserIcon className="h-4 w-4" />
//                     My Profile
//                   </Button>
//                 </Link>
//                 <form action="/auth/logout" method="post">
//                   <Button type="submit" variant="ghost">
//                     <LogOut className="h-4 w-4 mr-2" />
//                     Logout
//                   </Button>
//                 </form>
//               </>
//             ) : (
//               <>
//                 <Link href="/auth/login">
//                   <Button variant="outline" className="gap-2 bg-transparent">
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </Button>
//                 </Link>
//                 <Link href="/auth/sign-up">
//                   <Button className="gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }


function ClientNavigation() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return null;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">LoanPicks</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                All Products
              </Button>
            </Link>

            <Link href="/chat">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>

            <LoanComparisonDrawer
              trigger={
                <Button variant="ghost" size="sm">
                  <Scale className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              }
            />

            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>

                <form action="/auth/logout" method="post">
                  <Button type="submit" variant="ghost" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>

                <Link href="/auth/sign-up">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/products">
                  <Button variant="ghost" className="w-full justify-start">
                    All Products
                  </Button>
                </Link>

                <Link href="/chat">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                </Link>

                <LoanComparisonDrawer
                  trigger={
                    <Button variant="ghost" className="w-full justify-start">
                      <Scale className="h-4 w-4 mr-2" />
                      Compare Loans
                    </Button>
                  }
                />

                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>

                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <UserIcon className="h-4 w-4" />
                        My Profile
                      </Button>
                    </Link>

                    <form action="/auth/logout" method="post">
                      <Button type="submit" variant="ghost" className="w-full justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </Link>

                    <Link href="/auth/sign-up">
                      <Button className="w-full justify-start gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
