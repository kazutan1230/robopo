"use client"

import useSound from "use-sound"
import StartSound from "@/app/lib/sound/01_start.mp3"
import { type SelectCourse, type SelectPlayer } from "@/app/lib/db/schema"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ViewProps = {
  courseData: SelectCourse
  playerData: SelectPlayer
  competitionId: number
  umpireId: number
}

export const View = ({ courseData, playerData, competitionId, umpireId }: ViewProps) => {
  const playerId = playerData.id
  const [startSound] = useSound(StartSound, { volume: 0.4 })
  const router = useRouter()

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto w-full pt-10">
      {courseData !== null && playerId !== null && (
        <div className="grid gap-6 items-start justify-center sm:px-6 lg:px-8 text-start">
          <h2 className="text-lg">チャレンジを開始しますか?</h2>
          <p className="text-2xl">コース: {courseData.name}</p>
          <p className="text-2xl">選手: {playerData?.name}</p>
        </div>
      )}

      {/* ここにコースプレビューを入れる */}
      <Link
        href={`/challenge/${competitionId}/${umpireId}/${playerId}`}
        className="rounded-full flex justify-center items-center font-bold relative mt-10 mb-10 w-48 h-48 text-3xl bg-gradient-to-r from-green-400 to-green-600 text-white"
        onClick={() => {
          startSound()
        }}>
        <span>スタート</span>
      </Link>

      <button
        type="button"
        className="btn btn-primary min-w-28 max-w-fit mx-auto mt-5"
        onClick={() => {
          router.back()
        }}>
        選手選択に戻る
      </button>
    </div>
  )
}
