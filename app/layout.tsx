import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/app/components/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ROBOPO",
  description: "robopo",
}

export default function RootLayout({
  children,
}: // modal
Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={inter.className}>
      <body className="font-zenKakuGothicNew">
        <main className="max-w-screen-xl mx-auto text-xs sm:px-12 lg:text-base w-screen h-screen">
          <Header />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          {/* <ScrollToTop /> */}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
