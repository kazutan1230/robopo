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
    // modal: React.ReactNode;
}>) {
    return (
        <html lang="ja" className={inter.className}>
            <body className="font-zenKakuGothicNew">
                <Header />
                {/* <main className="max-w-screen-md mx-auto text-xs sm:px-12 lg:text-base"> */}
                <main className="grid gap-6 items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                    {/* {modal} */}
                    {/* <ScrollToTop /> */}
                </main>
                {/* <Footer /> */}
            </body>
        </html>
    )
}
