import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Nolinkheader } from "@/app/components/nolinkheader"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ROBOPO",
  description: "robopo",
}

export default function Layout({
  children,
}: // modal
Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Nolinkheader />
      {children}
    </Suspense>
  )
}
