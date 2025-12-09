import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { User, MessageSquare, TrendingDown, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getUserApplications } from "@/app/actions"
import { Navigation } from "../components/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const applications = await getUserApplications()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Under Review
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl">Welcome back!</CardTitle>
                  <CardDescription className="text-sm md:text-base break-all">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground">
                Your personalized dashboard is ready. Explore loans, track applications, and get AI-powered
                recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Link href="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Browse Loans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Compare all available loan products with filters</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Get personalized loan recommendations instantly</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>My Applications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{applications.length} total applications</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">My Loan Applications</h2>
            <p className="text-sm md:text-base text-muted-foreground">Track the status of your loan applications</p>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4">Start exploring loans and apply for the best rates</p>
                <Link href="/products">
                  <Button>Browse Loan Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader className="pb-3 md:pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {application.loan_product?.product_name || "Loan Application"}
                        </CardTitle>
                        <CardDescription>{application.loan_product?.bank_name || "Bank"}</CardDescription>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">₹{application.loan_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{application.loan_product?.interest_rate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applied On</p>
                        <p className="font-semibold">{new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Employment</p>
                        <p className="font-semibold capitalize">{application.employment_status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="gap-2">
              Explore More Loan Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
