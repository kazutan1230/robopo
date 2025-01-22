import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
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
    <Suspense fallback={<div>Loading...</div>}>
      {children}
      {modal}
    </Suspense>
  )
}
