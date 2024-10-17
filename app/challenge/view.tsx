"use client"
import Link from "next/link"
import { useState } from "react"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import ChallengeList from "@/app/challenge/challengeList"
import PlayerForm from "@/app/challenge/playerForm"
import Challenge from "@/app/challenge/challenge"
import CircleButton from "@/app/components/parts/circleButton"
import { SensorCourse } from "@/app/components/challenge/sensorCourse"

type ViewProps = {
  courseDataList: { selectCourses: SelectCourse[] }
  initialPlayerDataList: { players: SelectPlayer[] }
}

export const View = ({ courseDataList, initialPlayerDataList }: ViewProps) => {
  const [step, setStep] = useState(0)
  const [courseId, setCourseId] = useState<number | null>(null)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [playerDataList, setPlayerDataList] = useState<SelectPlayer[]>(initialPlayerDataList.players)
  const compeId: number = 1 //一旦1
  const umpireId: number = 1 //一旦1

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto w-full">
      {step === 0 && (
        <>
          {/* 通常コース */}
          <ChallengeList
            courseDataList={courseDataList}
            setStep={setStep}
            courseId={courseId}
            setCourseId={setCourseId}
          />
          {/* THE 一本橋 */}
          <button className="btn btn-primary mt-5" onClick={() => (setCourseId(-1), setStep(1))}>
            THE 一本橋
          </button>
          {/* センサーコース */}
          <button className="btn btn-primary mt-5" onClick={() => (setCourseId(-2), setStep(1))}>
            センサーコース
          </button>
        </>
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
          <div className="grid gap-6 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-center">
            <h2>以下の内容でチャレンジを開始します。</h2>
            <p className="text-2xl">
              コース: {courseDataList.selectCourses.find((course) => course.id === courseId)?.name}
            </p>
            <p className="text-2xl">選手: {playerDataList.find((player) => player.id === playerId)?.name}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary min-w-28 max-w-fit mx-auto text-3xl m-5 mb-20"
            onClick={() => {
              setStep(3)
            }}>
            スタート画面へ
          </button>
        </>
      )}

      {step === 3 && (
        <div>
          <h2>スタートを押すと始まります。</h2>
          <CircleButton
            onClick={() => setStep(4)}
            classNameText="mt-20 mb-20 w-48 h-48 text-3xl bg-gradient-to-r from-green-400 to-green-600 text-white"
            buttonText="スタート"
          />
        </div>
      )}

      {step === 4 && courseId !== null && courseId !== -2 && playerId !== null && (
        <Challenge
          field={courseDataList.selectCourses.find((course) => course.id === courseId)?.field}
          mission={courseDataList.selectCourses.find((course) => course.id === courseId)?.mission}
          point={courseDataList.selectCourses.find((course) => course.id === courseId)?.point}
          compeId={compeId}
          courseId={courseId}
          playerId={playerId}
          umpireId={umpireId}
        />
      )}

      {step === 4 && courseId === -2 && playerId !== null && (
        <SensorCourse compeId={compeId} courseId={-2} playerId={playerId} umpireId={umpireId} />
      )}

      {step !== 4 && (
        <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto mt-5">
          トップへ戻る
        </Link>
      )}
    </div>
  )
}
