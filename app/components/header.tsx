import Link from "next/link"
import Image from "next/image"
import DropdownMenu from "@/app/components/parts/dropdownMenu"

export const Header = () => {
  return (
    <header className="flex flex-row h-24 md:h-14 items-center relative">
      {/* Logo & DropdownMenu */}
      <div className="flex items-center w-auto">
        {/* Logo */}
        <div>
          <Link href="/" className="mr-auto">
            <Image src="/logo.png" alt="Logo" className="dark:invert" width={50} height={50} />
          </Link>
        </div>
        {/* メニューボタン (スマホ表示) */}
        <DropdownMenu />
      </div>
      {/* タイトル */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center text-xl md:text-3xl font-semibold whitespace-nowrap">
        ロボサバ大会集計アプリ
        <br className="md:hidden" />
        ROBOPO
      </h1>

      {/* HOMEボタン (PC表示) */}
      <Link href="/" className="hidden md:inline-block btn btn-primary p-2 text-xl ml-auto">
        Home
      </Link>
    </header>
  )
}
