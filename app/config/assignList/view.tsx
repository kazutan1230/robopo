"use client"
import Link from "next/link"
import { useState } from "react"
import type { SelectAssignList } from "@/app/lib/db/schema"
import CommonList from "@/app/components/common/commonList"

type AssignListProps = {
  assignList: SelectAssignList[]
}
export const View = ({ assignList }: AssignListProps) => {
  const [commonId, setCommonId] = useState<number | null>(null)
  return (
    <>
      <CommonList type="assign" commonId={commonId} setCommonId={setCommonId} commonDataList={assignList} />
      <Link href="/config/" className="btn btn-primary mx-auto m-3">
        戻る
      </Link>
    </>
  )
}
