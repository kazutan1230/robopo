import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PageLoading } from "@/app/components/parts/pageLoading"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ROBOPO",
  description: "robopo",
}

export default function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
      {modal}
    </Suspense>
  )
}
