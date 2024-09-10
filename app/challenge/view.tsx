"use client"
import Link from "next/link"
import { useState } from "react"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import ChallengeList from "@/app/challenge/challengeList"
import PlayerForm from "@/app/challenge/playerForm"
import Challenge from "@/app/challenge/challenge"
import CircleButton from "@/app/components/parts/circleButton"

type ViewProps = {
  courseDataList: { selectCourses: SelectCourse[] }
  initialPlayerDataList: { players: SelectPlayer[] }
}

export const View = ({ courseDataList, initialPlayerDataList }: ViewProps) => {
  const [step, setStep] = useState(0)
  const [courseId, setCourseId] = useState<number | null>(null)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [playerDataList, setPlayerDataList] = useState<SelectPlayer[]>(initialPlayerDataList.players)
  const compeId: number = 0 //一旦0
  const umpireId: number = 0 //一旦0

  return (
    <>
      {step === 0 && (
        <ChallengeList
          courseDataList={courseDataList}
          setStep={setStep}
          courseId={courseId}
          setCourseId={setCourseId}
        />
      )}
      {step === 1 && (
        <PlayerForm
          playerDataList={playerDataList}
          setPlayerDataList={setPlayerDataList}
          setStep={setStep}
          playerId={playerId}
          setPlayerId={setPlayerId}
        />
      )}
      {step === 2 && courseId !== null && playerId !== null && (
        <>
          <div>
            <h2>以下の内容でチャレンジを開始します。</h2>
            <p>コース: {courseDataList.selectCourses.find((course) => course.id === courseId)?.name}</p>
            <p>選手: {playerDataList.find((player) => player.id === playerId)?.name}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary min-w-28 max-w-fit mx-auto"
            onClick={() => {
              setStep(3)
            }}>
            スタート画面へ
          </button>
        </>
      )}

      {step === 3 && (
        <div>
          <h2>押したら始まります。</h2>
          <CircleButton
            onClick={() => setStep(4)}
            classNameText="mt-20 mb-20 w-48 h-48 text-3xl bg-gradient-to-r from-green-400 to-green-600 text-white"
            buttonText="スタート"
          />
        </div>
      )}

      {step === 4 && (
        <div>
          {/* <p>{courseDataList.selectCourses.find((course) => course.id === courseId)?.mission}</p>
          <p>{courseDataList.selectCourses.find((course) => course.id === courseId)?.point}</p> */}
          <Challenge
            setStep={setStep}
            mission={courseDataList.selectCourses.find((course) => course.id === courseId)?.mission}
            point={courseDataList.selectCourses.find((course) => course.id === courseId)?.point}
          />
          <button
            type="button"
            className="btn btn-primary min-w-28 max-w-fit mx-auto"
            onClick={() => {
              setStep(0)
            }}>
            終了
          </button>
        </div>
      )}

      {step !== 4 && (
        <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto">
          トップへ戻る
        </Link>
      )}
    </>
  )
}
