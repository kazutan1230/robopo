"use client"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

const DropdownMenu = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // メニュー外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("click", handleClickOutside)

    return () => {
      window.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // メニューの開閉をトグル
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation() // メニューのクリックをイベント伝播から除外
    setOpen(!isOpen)
  }

  return (
    <div ref={ref} className="dropdown dropdown-end md:hidden fixed right-[5%] z-50 space-y-2">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        onClick={toggleMenu} // メニューを開閉
      >
        <svg
          className="w-[48px] h-[48px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24">
          {isOpen ? (
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          ) : (
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
          )}
        </svg>
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          onClick={() => setOpen(false)} // メニュー内のアイテムクリック時に閉じる
        >
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      )}
    </div>
  )
}

export default DropdownMenu
