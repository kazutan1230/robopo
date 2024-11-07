import Link from "next/link"
import { EditList } from "@/app/(linkheader)/course/editList"

export default function Course() {
  return (
    <>
      <Link href="/course/edit" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        コース新規作成
      </Link>
      <EditList />
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        トップへ戻る
      </Link>
    </>
  )
}
