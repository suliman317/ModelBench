import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ModelBench - Premium AI Model Comparison",
  description:
    "A visually stunning, professional-grade comparison tool for AI language models. Compare GPT-4, Claude, Mistral, and more with beautiful glassmorphism UI.",
  keywords: "AI, language models, GPT-4, Claude, Mistral, comparison, benchmark, glassmorphism",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "ModelBench - Premium AI Model Comparison",
    description: "Compare AI language models with a stunning, professional interface",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
