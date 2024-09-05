import Link from "next/link"
import { List } from "@/app/components/course/list"

export default function Course() {
  return (
    <>
      <Link href="/course/edit" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        コース新規作成
      </Link>
      <List />
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        トップへ戻る
      </Link>
    </>
  )
}
