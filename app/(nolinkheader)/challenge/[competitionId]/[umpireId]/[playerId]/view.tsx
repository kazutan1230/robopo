"use client"
import { useState } from "react"
import useSound from "use-sound"
import { type SelectCourse, type SelectPlayer } from "@/app/lib/db/schema"
import Challenge from "@/app/(nolinkheader)/challenge/challenge"
import CircleButton from "@/app/components/parts/circleButton"
import { SensorCourse } from "@/app/components/challenge/sensorCourse"
import StartSound from "@/app/lib/sound/01_start.mp3"
import Link from "next/link"

type ViewProps = {
  courseData: SelectCourse
  playerData: SelectPlayer
  competitionId: number
  umpireId: number
}

export const View = ({ courseData, playerData, competitionId, umpireId }: ViewProps) => {
  const [step, setStep] = useState(0)
  const courseId = courseData.id
  const playerId = playerData.id

  const [startSound] = useSound(StartSound, { volume: 0.4 })

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto w-full pt-10">
      {step === 0 && courseId !== null && playerId !== null && (
        <>
          <div className="grid gap-6 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-center">
            <h2>以下の内容でチャレンジを開始します。</h2>
            <p className="text-2xl">コース: {courseData.name}</p>
            <p className="text-2xl">選手: {playerData?.name}</p>
          </div>
          <CircleButton
            onClick={() => (setStep(1), startSound())}
            classNameText="mt-10 mb-10 w-48 h-48 text-3xl bg-gradient-to-r from-green-400 to-green-600 text-white"
            buttonText="スタート"
          />
        </>
      )}

      {step === 1 && courseId !== null && courseId !== -2 && playerId !== null && (
        <Challenge
          field={courseData.field}
          mission={courseData.mission}
          point={courseData.point}
          compeId={competitionId}
          courseId={courseId}
          playerId={playerId}
          umpireId={umpireId}
        />
      )}

      {step === 1 && courseId === -2 && playerId !== null && (
        <SensorCourse compeId={competitionId} courseId={-2} playerId={playerId} umpireId={umpireId} />
      )}

      {step !== 1 && (
        <Link
          href={`/challenge/${competitionId}/${umpireId}`}
          className="btn btn-primary min-w-28 max-w-fit mx-auto mt-5">
          選手選択に戻る
        </Link>
      )}
    </div>
  )
}
