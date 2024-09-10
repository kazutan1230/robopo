import { useState } from "react"
import Link from "next/link"
import CircleButton from "@/app/components/parts/circleButton"
import {
  MissionString,
  PointState,
  deserializeMission,
  deserializePoint,
  missionStatePair,
  panelOrDegree,
} from "@/app/components/course/util"

type ChallengeProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>
  mission: string | null | undefined
  point: string | null | undefined
}

const Challenge = ({ setStep, mission, point }: ChallengeProps) => {
  if (mission !== null && mission !== undefined && point !== null && point !== undefined) {
    const missionPair = missionStatePair(deserializeMission(mission))
    const pointState: PointState = deserializePoint(point)
    const [isRetry, setIsRetry] = useState<boolean>(false)
    const [isGoal, setIsGoal] = useState<boolean>(false)
    const [isFailed, setIsFailed] = useState<boolean>(false)
    const [nowMission, setNowMission] = useState<number>(0) // 今のミッションのindex
    const [result1, setResult1] = useState<number>(0)
    const [result2, setResult2] = useState<number | null>(null)

    const handleNext = () => {
      if (nowMission < missionPair.length && pointState[nowMission + 2] !== null) {
        let tmp: number = 0
        // これでゴールか
        if (nowMission === missionPair.length - 1) {
          // 全クリアでゴールポイントを加算
          tmp += Number(pointState[1])
          setIsGoal(true)
        } else {
          setNowMission(nowMission + 1)
        }
        // 一回目か
        if (!isRetry) {
          tmp += result1 + Number(pointState[nowMission + 2])
        } else {
          // リトライか
          // const tmp = result2 + Number(pointState[nowMission + 2])
          // setResult2(tmp)
        }
        setResult1(tmp)
      } else {
        setNowMission(0)
      }
    }

    const handleback = () => {
      if (nowMission > 0) {
        if (!isRetry) {
          const tmp = result1 - Number(pointState[nowMission + 1])
          setResult1(tmp)
        } else {
          // リトライか
          // const tmp = result2 + Number(pointState[nowMission + 1])
          // setResult2(tmp)
        }
        setNowMission(nowMission - 1)
      }
    }

    return (
      <>
        <div className="grid justify-items-center h-full">
          {isGoal ? (
            <>
              <div className="grid justify-items-center mx-4">
                <p className="text-3xl font-bold text-orange-600">おめでとう</p>
                <p className="text-3xl font-bold text-orange-600">現在: {isRetry ? result2 : result1}ポイント</p>
              </div>
            </>
          ) : (
            <>
              <div className="grid justify-items-center mx-4">
                <p>チャレンジ中</p>
                <p>↓ミッション↓</p>
                <p className="text-3xl font-bold text-orange-600">
                  {nowMission + 1} :{" "}
                  {missionPair[nowMission][0] === null ? "-" : MissionString[missionPair[nowMission][0]]}
                  {missionPair[nowMission][1] === null ? "-" : missionPair[nowMission][1]}
                  {missionPair[nowMission][0] === null ? "-" : panelOrDegree(missionPair[nowMission][0])}
                </p>
                <p>{pointState[nowMission + 2]}ポイント</p>
              </div>

              <CircleButton
                onClick={handleNext}
                classNameText="mt-12 mb-12 w-36 h-36 text-6xl bg-gradient-to-r from-green-400 to-green-600 text-white"
                buttonText="OK"
              />
              <p className="text-3xl font-bold text-orange-600">現在: {isRetry ? result2 : result1}ポイント</p>
            </>
          )}
          <div className="grid grid-cols-2 gap-4 p-4">
            <button
              type="button"
              id="add"
              className="btn btn-primary mx-auto"
              onClick={handleback}
              // disabled={nowMission === 0}
            >
              1つ戻る
            </button>
            <button type="button" id="update" className="btn btn-primary mx-auto">
              やり直し
            </button>
          </div>
          <p>{mission}</p>
          <p>{point}</p>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div>エラーです。</div>
        <Link href="/challenge" className="btn btn-primary mx-auto">
          やり直し
        </Link>
      </>
    )
  }
}

export default Challenge
