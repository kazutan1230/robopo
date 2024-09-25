import { useState } from "react"
import CircleButton from "@/app/components/parts/circleButton"
import {
  MissionString,
  PointState,
  deserializeMission,
  deserializePoint,
  missionStatePair,
  panelOrDegree,
} from "@/app/components/course/utils"
import FailureModal from "@/app/challenge/failureModal"
import { calcPoint } from "@/app/components/challenge/utils"
type ChallengeProps = {
  mission: string | null | undefined
  point: string | null | undefined
  compeId: number
  courseId: number
  playerId: number
  umpireId: number
}

const Challenge = ({ mission, point, compeId, courseId, playerId, umpireId }: ChallengeProps) => {
  if (mission !== null && mission !== undefined && point !== null && point !== undefined) {
    const missionPair = missionStatePair(deserializeMission(mission))
    const pointState: PointState = deserializePoint(point)
    const [isRetry, setIsRetry] = useState<boolean>(false)
    const [isGoal, setIsGoal] = useState<boolean>(false)
    const [nowMission, setNowMission] = useState<number>(0) // 今のミッションのindex
    const [pointCount, setPointCount] = useState<number | null>(0) // 今の得点
    const [result1, setResult1] = useState<number>(0) // 進んだmission
    const [result2, setResult2] = useState<number | null>(null) // 進んだmission, やり直してない場合はnull
    const [loading, setLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const handleNext = () => {
      if (nowMission < missionPair.length && pointState[nowMission + 2] !== null) {
        // ポイントを加算
        const point = calcPoint(pointState, nowMission + 1)
        setPointCount(point)
        // これでゴールか
        if (nowMission === missionPair.length - 1) {
          // 全クリアでゴールポイントを加算
          setIsGoal(true)
        } else {
          setNowMission(nowMission + 1)
        }
        // 一回目か
        if (!isRetry) {
          setResult1(result1 + 1)
        } else if (result2 !== null) {
          // リトライか
          setResult2(result2 + 1)
        }
      } else {
        setNowMission(0)
      }
    }

    // 押し間違えた時1つ前のミッションに戻る
    const handleBack = () => {
      if (nowMission > 0) {
        if (!isRetry) {
          setResult1(result1 - 1)
        } else if (result2 !== null) {
          // リトライか
          setResult2(result2 - 1)
        }
        const point = calcPoint(pointState, nowMission - 1)
        setPointCount(point)
        setNowMission(nowMission - 1)
      }
    }

    // やり直しする時
    const handleRetry = () => {
      setIsRetry(true)
      setResult2(0)
      setPointCount(0)
      setNowMission(0)
    }

    // 結果送信
    const handleSubmit = async () => {
      setLoading(true)

      const requestBody = {
        result1: result1,
        result2: result2,
        competitionId: compeId,
        courseId: courseId,
        playerId: playerId,
        umpireId: umpireId,
      }

      try {
        const response = await fetch("/api/challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })
        const data = await response.json()

        console.log(data)
        if (response.ok) {
          setMessage("チャレンジの送信に成功しました")
          setIsSuccess(true)
        } else {
          setMessage("チャレンジの送信に失敗しました")
        }
      } catch (error) {
        console.log("error: ", error)
        setMessage("送信中にエラーが発生しました")
      } finally {
        setLoading(false)
      }
    }

    return (
      <>
        <div className="grid justify-items-center h-full">
          {isGoal ? (
            <>
              {/* <div className="flex flex-col justify-items-center gap-4 mx-4"> */}
              <div className="grid gap-6 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 text-center">
                <p className="text-3xl font-bold text-orange-600">おめでとう!</p>
                {pointState[1] !== null && pointState[1] > 0 && (
                  <p className="text-2xl font-bold text-orange-600">ゴールポイント: {pointState[1]}ポイント</p>
                )}
                <p className="text-2xl font-bold text-orange-600">結果: クリア {pointCount}ポイント</p>
                {isSuccess ? (
                  // チャレンジ終了後、画面読み込み直して初期状態に戻る
                  <button className="btn btn-accent mx-auto text-2xl" onClick={() => window.location.reload()}>
                    コース一覧に戻る
                  </button>
                ) : (
                  <button className="btn btn-accent mx-auto text-2xl" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : "結果送信"}
                  </button>
                )}
                {message && <p className="mx-auto mt-12">{message}</p>}
              </div>
            </>
          ) : (
            <>
              <div className="grid justify-items-center mx-4">
                <p>{isRetry ? "やり直し中" : "チャレンジ中"}</p>
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
              <p className="text-3xl font-bold text-orange-600">現在: {pointCount}ポイント</p>
              <div className="grid grid-cols-2 gap-4 p-4">
                <button
                  type="button"
                  id="add"
                  className="btn btn-primary mx-auto"
                  onClick={handleBack}
                  disabled={nowMission === 0}>
                  1つ戻る
                </button>
                <button type="button" className="btn btn-neutral mx-auto" onClick={() => setModalOpen(true)}>
                  失敗
                </button>
                {!isRetry && (
                  <button type="button" className="btn btn-primary mx-auto " onClick={handleRetry}>
                    やり直し
                  </button>
                )}
              </div>
            </>
          )}
          {modalOpen && (
            <FailureModal
              setModalOpen={setModalOpen}
              handleSubmit={handleSubmit}
              loading={loading}
              isSuccess={isSuccess}
              message={message}
              result1Point={calcPoint(pointState, result1 - 1)}
              result2Point={result2 !== null ? calcPoint(pointState, result2 - 1) : null}
            />
          )}
        </div>
      </>
    )
  } else {
    return (
      <>
        <div>エラーです。</div>
        <button className="btn btn-accent mx-auto text-2xl" onClick={() => window.location.reload()}>
          再読み込み
        </button>
      </>
    )
  }
}

export default Challenge
