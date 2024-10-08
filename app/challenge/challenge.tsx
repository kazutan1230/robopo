import { useState } from "react"
import {
  MissionString,
  PointState,
  deserializeField,
  deserializeMission,
  deserializePoint,
  missionStatePair,
  panelOrDegree,
  findStart,
  getRobotPosition,
} from "@/app/components/course/utils"
import { Field } from "@/app/components/course/field"
import ChallengeModal from "@/app/challenge/challengeModal"
import { calcPoint, resultSubmit } from "@/app/components/challenge/utils"

type ChallengeProps = {
  field: string | null | undefined
  mission: string | null | undefined
  point: string | null | undefined
  compeId: number
  courseId: number
  playerId: number
  umpireId: number
}

const Challenge = ({ field, mission, point, compeId, courseId, playerId, umpireId }: ChallengeProps) => {
  if (
    field !== null &&
    field !== undefined &&
    mission !== null &&
    mission !== undefined &&
    point !== null &&
    point !== undefined
  ) {
    const fieldState = deserializeField(field)
    const missionState = deserializeMission(mission)
    const missionPair = missionStatePair(missionState)
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

    const start = findStart(fieldState)
    const [botPosition, setBotPosition] = useState({ row: start?.[0] || 0, col: start?.[1] || 0 })
    const [botDirection, setBotDirection] = useState(missionState[0])

    const [strictMode, setStrictMode] = useState<boolean>(false)

    // クリックされたpanelの情報を入れる
    const handleNext = (row: number, col: number) => {
      if (nowMission < missionPair.length && pointState[nowMission + 2] !== null) {
        const [newRow, newCol, direction] = getRobotPosition(
          start?.[0] || 0,
          start?.[1] || 0,
          missionState,
          nowMission + 1
        )
        // 厳密タップモードonで正しい次のミッションの位置を押した場合又は厳密タップモードOffの場合
        if ((strictMode && newRow === row && newCol === col) || !strictMode) {
          // ポイントを加算
          const point = calcPoint(pointState, nowMission + 1)
          setPointCount(point)
          // これでゴールか
          if (nowMission === missionPair.length - 1) {
            // 全クリアでゴールポイントを加算
            setIsGoal(true)
            setModalOpen(true)
          }
          // goalの時もnowMissionを進めるから不具合あるかも。
          setNowMission(nowMission + 1)
          // 一回目か
          if (!isRetry) {
            setResult1(result1 + 1)
            console.log("result1", result1)
          } else if (result2 !== null) {
            // リトライか
            setResult2(result2 + 1)
            console.log("result2", result2)
          }
          // ロボットを動かす
          setBotPosition({ row: newRow, col: newCol })
          setBotDirection(direction)
          console.log("row, col, direction", row, col, direction)
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
        // ポイントを戻す
        const point = calcPoint(pointState, nowMission - 1)
        setPointCount(point)
        // ロボットを戻す
        const [row, col, direction] = getRobotPosition(start?.[0] || 0, start?.[1] || 0, missionState, nowMission - 1)
        setBotPosition({ row: row, col: col })
        setBotDirection(direction)
        // nowMissionを戻す
        setNowMission(nowMission - 1)
        // goalしたのを戻す
        if (isGoal) {
          setIsGoal(false)
        }
      }
    }

    // やり直しする時
    const handleRetry = () => {
      setIsRetry(true)
      setResult2(0)
      setPointCount(0)
      setNowMission(0)
      setBotPosition({ row: start?.[0] || 0, col: start?.[1] || 0 })
      setBotDirection(missionState[0])
    }

    return (
      <>
        <div className="grid justify-items-center h-full w-screen sm:w-5/6">
          {isGoal ? (
            <>
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
                <button
                  className="btn btn-accent mx-auto text-2xl"
                  onClick={() => setModalOpen(true)}
                  disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : "結果送信"}
                </button>
              )}
              {message && <p className="mx-auto mt-12">{message}</p>}
            </>
          ) : (
            <>
              <div className="flex flex-row w-full">
                <div className="w-1/3"></div>
                <div className="w-1/3 grid justify-items-center">
                  <p>{isRetry ? "やり直し中" : "チャレンジ中"}</p>
                  <p>↓ミッション↓</p>
                </div>
                <div className="w-1/3 grid items-center justify-end">
                  <label className="cursor-pointer flex items-center w-full">
                    <div className="grid grid-col">
                      <span className="mr-2">厳密タップモード</span>
                      <input
                        type="checkbox"
                        checked={strictMode}
                        className="toggle toggle-primary ml-auto mr-2"
                        onChange={() => (strictMode ? setStrictMode(false) : setStrictMode(true))}
                      />
                    </div>
                  </label>
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {nowMission + 1} :{" "}
                {missionPair[nowMission][0] === null ? "-" : MissionString[missionPair[nowMission][0]]}
                {missionPair[nowMission][1] === null ? "-" : missionPair[nowMission][1]}
                {missionPair[nowMission][0] === null ? "-" : panelOrDegree(missionPair[nowMission][0])}
              </p>
              <p>{pointState[nowMission + 2]}ポイント</p>
            </>
          )}
          <Field
            type="challenge"
            field={fieldState}
            botPosition={botPosition}
            botDirection={botDirection}
            // ゴール後の表示はゴール前のmissionPairで出すので、おかしくなるかも。
            nextMissionPair={isGoal ? missionPair[nowMission - 1] : missionPair[nowMission]}
            onPanelClick={(row, col) => handleNext(row, col)}
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
            <button
              type="button"
              className="btn btn-neutral mx-auto"
              onClick={() => setModalOpen(true)}
              disabled={isGoal}>
              失敗
            </button>
            {!isRetry && (
              <button type="button" className="btn btn-primary mx-auto " onClick={handleRetry}>
                やり直し
              </button>
            )}
          </div>
          {modalOpen && (
            <ChallengeModal
              setModalOpen={setModalOpen}
              handleSubmit={() =>
                resultSubmit(
                  result1,
                  result2,
                  compeId,
                  courseId,
                  playerId,
                  umpireId,
                  setMessage,
                  setIsSuccess,
                  setLoading
                )
              }
              loading={loading}
              isSuccess={isSuccess}
              message={message}
              result1Point={isRetry ? calcPoint(pointState, result1) : pointCount}
              result2Point={isRetry ? pointCount : null}
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
