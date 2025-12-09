// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


// import { getTopLoans } from "@/app/actions"
import { getTopLoans } from "./actions"
import { LoanCard } from "./components/loan-card"
import { Button } from "./components/ui/button"
import { MessageSquare, ArrowRight, Sparkles, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Navigation } from "./components/navigation"

export default async function HomePage() {
  const topLoans = await getTopLoans(5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Find Your Perfect Loan in Minutes
          </h2>
          <p className="text-base md:text-xl text-muted-foreground text-pretty">
            Compare loans from top banks, get personalized recommendations, and apply instantly. Our AI assistant helps
            you make informed financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Browse All Loans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
                <MessageSquare className="h-4 w-4" />
                Talk to AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top 5 Loans Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Top 5 Loan Picks</h3>
              <p className="text-muted-foreground mt-2">Best interest rates available right now</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 bg-transparent">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topLoans.map((loan, index) => (
              <LoanCard key={loan.id} loan={loan} rank={index + 1} showRank={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary/10 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">AI-Powered Recommendations</h4>
            <p className="text-muted-foreground">
              Get personalized loan suggestions based on your financial profile and needs
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary/10 rounded-full">
              <TrendingDown className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">Best Rates Guaranteed</h4>
            <p className="text-muted-foreground">
              Compare interest rates from multiple banks to find the most competitive offers
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary/10 rounded-full">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">24/7 AI Assistant</h4>
            <p className="text-muted-foreground">
              Chat with our AI to get instant answers about loans, eligibility, and more
            </p>
          </div>
        </div>
      </section>

      
    </div>
  )
}
