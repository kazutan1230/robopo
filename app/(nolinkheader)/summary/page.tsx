import Link from "next/link"
import { View } from "@/app/(nolinkheader)/summary/view"

export default async function Summary() {
  return (
    <div className="h-full w-full">
      <View />
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto mt-10">
        トップへ戻る
      </Link>
    </div>
  )
}
