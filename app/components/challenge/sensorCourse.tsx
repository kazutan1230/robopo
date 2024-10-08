import React, { useState } from "react"
import { resultSubmit } from "@/app/components/challenge/utils"
import ChallengeModal from "@/app/challenge/challengeModal"

type SensorCourseProps = {
  compeId: number
  courseId: number
  playerId: number
  umpireId: number
}

export const SensorCourse = ({ compeId, courseId, playerId, umpireId }: SensorCourseProps) => {
  const [result1, setResult1] = useState<number>(0) // 進んだmission
  const [wallStop, setWallStop] = useState<boolean>(false)
  const [tunnelPoint, setTunnelPoint] = useState<number>(0)
  const [wallPoint, setWallPoint] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [modalOpen, setModalOpen] = useState(false)
  const [pointCount, setPointCount] = useState<number>(0)
  const [isRetry, setIsRetry] = useState<boolean>(false)

  // 壁停止のポイント配列を-5から20まで1ポイント毎で作成
  const wallPointArray = Array.from({ length: 26 }, (_, i) => i - 5)

  // チェックボックス選択で得点計算する
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // トンネル停止
    if (e.target.id === "tunnel") {
      if (e.target.checked) {
        setTunnelPoint(10)
        setPointCount(wallPoint + 10)
      } else {
        setTunnelPoint(0)
        setPointCount(wallPoint)
      }
    }
    // 壁停止
    if (e.target.id === "wall") {
      if (e.target.checked) {
        setWallStop(true)
      } else {
        setWallStop(false)
      }
    }
  }

  // 壁停止のポイント選択
  const handleWallPointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setPointCount(tunnelPoint + value)
    setWallPoint(value)
  }
  // やり直しする時
  const handleRetry = () => {
    setResult1(pointCount)
    setIsRetry(true)
    setTunnelPoint(0)
    setWallPoint(0)
    setWallStop(false)
    setPointCount(0)
  }

  return (
    <div className="relative flex flex-col justify-items-center w-full h-[calc(100vh-100px)]">
      <div className="grid justify-items-center w-full">
        <p className="text-xl font-bold">センサーコース</p>
      </div>
      <div className="flex flex-col">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-3xl font-bold text-orange-600">現在:</div>
            <div className="stat-value text-3xl font-bold text-orange-600">{pointCount}ポイント</div>
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="w-1/5"></div>
          <div>
            <label className="label justify-start text-xl mx-auto m-3">
              <input
                type="checkbox"
                id="tunnel"
                className="checkbox checkbox-lg checkbox-primary"
                onChange={(e) => handleCheckboxChange(e)}
                checked={tunnelPoint === 10}
              />
              <p className="text-xl ml-3">トンネルで停止 10P</p>
            </label>
            <label className="label justify-start text-xl mx-auto m-3">
              <input
                type="checkbox"
                id="wall"
                className="checkbox checkbox-lg checkbox-primary"
                onChange={(e) => handleCheckboxChange(e)}
                checked={wallStop}
              />
              <p className="text-xl ml-3">壁で停止</p>
            </label>
            {wallStop && (
              <label className="label justify-start text-xl mx-auto m-3">
                <select
                  className="select select-bordered max-w-xs"
                  disabled={!wallStop}
                  onChange={(e) => handleWallPointChange(e)}>
                  <option disabled selected>
                    選択して下さい
                  </option>
                  {wallPointArray.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <p className="text-xl ml-3">ポイント</p>
              </label>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full">
          <button type="button" className="btn btn-accent mx-auto m-3" onClick={() => setModalOpen(true)}>
            結果送信
          </button>
          <button type="button" className="btn btn-primary mx-auto m-3" onClick={handleRetry} disabled={isRetry}>
            やり直し
          </button>
        </div>
      </div>
      {modalOpen && (
        // センサーコースはresultにそのまま得点を入れる。
        <ChallengeModal
          setModalOpen={setModalOpen}
          handleSubmit={() =>
            resultSubmit(
              isRetry ? result1 : pointCount,
              isRetry ? pointCount : null,
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
          result1Point={isRetry ? result1 : pointCount}
          result2Point={isRetry ? pointCount : null}
        />
      )}
    </div>
  )
}
