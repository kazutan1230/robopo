"use client"
import Link from "next/link"
import { useState } from "react"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import { ChallengeList } from "@/app/challenge/challengeList"
import PlayerForm from "@/app/challenge/playerForm"

type ViewProps = {
  courseDataList: { selectCourses: SelectCourse[] }
  initialPlayerDataList: { players: SelectPlayer[] }
}

export const View = ({ courseDataList, initialPlayerDataList }: ViewProps) => {
  const [step, setStep] = useState(0)
  return (
    <>
      {step === 0 && <ChallengeList courseDataList={courseDataList} setStep={setStep} />}
      {step === 1 && <PlayerForm initialPlayerDataList={initialPlayerDataList} setStep={setStep} />}
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        トップへ戻る
      </Link>
    </>
  )
}
