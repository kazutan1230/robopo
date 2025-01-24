import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/app/components/header"
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
    <>
      <Header />
      {children}
    </>
  )
}
