"use client"
import { useState } from "react"
import useSound from "use-sound"
import { type SelectCourse, type SelectPlayer } from "@/app/lib/db/schema"
import CommonList from "@/app/components/common/commonList"
import Challenge from "@/app/(nolinkheader)/challenge/challenge"
import CircleButton from "@/app/components/parts/circleButton"
import { SensorCourse } from "@/app/components/challenge/sensorCourse"
import StartSound from "@/app/lib/sound/01_start.mp3"

type ViewProps = {
  courseData: SelectCourse
  initialPlayerDataList: { players: SelectPlayer[] }
  competitionId: number
  umpireId: number
}

export const View = ({ courseData, initialPlayerDataList, competitionId, umpireId }: ViewProps) => {
  const [step, setStep] = useState(0)
  const courseId = courseData.id
  const [playerId, setPlayerId] = useState<number | null>(null)
  const playerDataList = initialPlayerDataList.players

  const [startSound] = useSound(StartSound, { volume: 0.4 })

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto w-full">
      {step === 0 && (
        <>
          <CommonList type="player" commonId={playerId} setCommonId={setPlayerId} commonDataList={playerDataList} />
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="btn btn-primary mx-auto m-3"
              disabled={playerId === null}
              onClick={() => setStep(1)}>
              確認へ
            </button>
          </div>
        </>
      )}
      {step === 1 && courseId !== null && playerId !== null && (
        <>
          <div className="grid gap-6 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-center">
            <h2>以下の内容でチャレンジを開始します。</h2>
            <p className="text-2xl">コース: {courseData.name}</p>
            <p className="text-2xl">選手: {playerDataList.find((player) => player.id === playerId)?.name}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary min-w-28 max-w-fit mx-auto text-3xl m-5 mb-20"
            onClick={() => {
              setStep(2)
            }}>
            スタート画面へ
          </button>
        </>
      )}

      {step === 2 && (
        <div>
          <h2>スタートを押すと始まります。</h2>
          <CircleButton
            onClick={() => (setStep(3), startSound())}
            classNameText="mt-20 mb-20 w-48 h-48 text-3xl bg-gradient-to-r from-green-400 to-green-600 text-white"
            buttonText="スタート"
          />
        </div>
      )}

      {step === 3 && courseId !== null && courseId !== -2 && playerId !== null && (
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

      {step === 3 && courseId === -2 && playerId !== null && (
        <SensorCourse compeId={competitionId} courseId={-2} playerId={playerId} umpireId={umpireId} />
      )}

      {step !== 3 && (
        <button
          type="button"
          className="btn btn-primary min-w-28 max-w-fit mx-auto mt-5"
          onClick={() => window.location.reload()}>
          再読み込み
        </button>
      )}
    </div>
  )
}
