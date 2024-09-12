"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import DropdownMenu from "@/app/components/parts/dropdownMenu"

export const Header = () => {
  const [isOpen, setOpen] = useState(false)

  const handleMenuOpen = () => {
    console.log("isopenbf", isOpen)
    setOpen(!isOpen)
    console.log("isopenaf", isOpen)
  }

  const handleMenuClose = () => {
    console.log("isopenbf", isOpen)
    setOpen(false)
    console.log("isopenaf", isOpen)
  }

  return (
    <header className="flex flex-col md:flex-row h-28 md:h-14 mb-5 justify-between items-center">
      <div className="flex justify-between w-full items-center md:w-auto md:justify-start">
        {/* Logo */}
        <Link href="/" className="inline-block mx-auto md:mx-0">
          <Image src="/logo.png" alt="Logo" className="dark:invert" width={50} height={50} />
        </Link>
        {/* メニューボタン (スマホ表示) */}
        <DropdownMenu />
      </div>
      {/* タイトル */}
      <h1 className="mt-4 md:mt-0 font-semibold items-center mx-auto text-center text-2xl">
        ロボサバ大会集計アプリ
        <br className="md:hidden" />
        ROBOPO
      </h1>
      {/* HOMEボタン (PC表示) */}
      <Link href="/" className="hidden md:inline-block btn btn-primary mt-5 mx-3 p-2 text-xl">
        Home
      </Link>
    </header>
  )
}
