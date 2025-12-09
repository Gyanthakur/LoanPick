"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-10">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">LoanPicks</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Your trusted partner for choosing the best loan products with AI-powered assistance.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              <Link href="https://www.facebook.com/profile.php?id=100026766931684" target="_blank">
                <Facebook className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://x.com/gps_96169" target="_blank">
                <Twitter className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://github.com/gyanthakur" target="_blank">
                <Github className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://www.linkedin.com/in/gyan-pratap-singh-275785236/" target="_blank">
                <Linkedin className="h-5 w-5 hover:text-primary transition" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
              <li><Link href="/chat" className="hover:text-primary">AI Assistant</Link></li>
              <li><Link href="/profile" className="hover:text-primary">profile</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-primary">Refund Policy</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@loanpicks.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 8957818597
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Sultanpur, Uttar Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LoanPicks. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
