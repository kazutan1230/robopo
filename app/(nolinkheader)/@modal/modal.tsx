"use client"

import { type RefObject, type JSX, type ReactNode, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Modal({ children }: Readonly<{ children: ReactNode }>): JSX.Element | null {
  // forward routing(router.back()以外のLink遷移)でmodalを閉じるための処理
  const pathname = usePathname()
  if (!pathname.includes("confirm")) return null

  const dialogRef: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  })

  return (
    <dialog ref={dialogRef} className="modal modal-open">
      <div className="modal-box flex flex-col justify-center">{children}</div>
    </dialog>
  )
}
