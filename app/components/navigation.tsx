import { createClient } from "@/lib/supabase/server"
import { Button } from "./ui/button"
import { MessageSquare, Sparkles, LogIn, UserPlus, Scale, User, LayoutDashboard, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { LoanComparisonDrawer } from "../components/loan-comparison-drawer"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

export async function Navigation() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">LoanPicks</h1>
          </Link>

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
                    <User className="h-4 w-4" />
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
                        <User className="h-4 w-4" />
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
  )
}
