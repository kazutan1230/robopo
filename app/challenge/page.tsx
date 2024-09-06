import Link from "next/link"
import { ChallengeList } from "@/app/challenge/challengeList"

export default function Course() {
  return (
    <>
      <ChallengeList />
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        トップへ戻る
      </Link>
    </>
  )
}
