import Image from "next/legacy/image"

export const Nolinkheader = () => {
  return (
    <header className="flex flex-row h-24 md:h-14 items-center relative">
      {/* Logo & DropdownMenu */}
      <div className="flex items-center w-auto">
        {/* Logo */}
        <div>
          <Image src="/logo.png" alt="Logo" className="dark:invert" width={50} height={50} />
        </div>
      </div>
      {/* タイトル */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center text-xl md:text-3xl font-semibold whitespace-nowrap">
        ロボサバ大会集計アプリ
        <br className="md:hidden" />
        ROBOPO
      </h1>
    </header>
  )
}
