import React, { useState } from "react"
import {
  getPanelWidth,
  getPanelHeight,
  FieldState,
  MissionValue,
  PointState,
  deserializePoint,
  IPPON_BASHI_SIZE,
} from "@/app/components/course/utils"
import { calcPoint, resultSubmit } from "@/app/components/challenge/utils"
import { Panel } from "@/app/components/course/panel"
import { Robot } from "@/app/components/course/robot"
import { NextArrow } from "@/app/components/course/nextArrow"
import ChallengeModal from "@/app/challenge/challengeModal"

type IpponBashiProps = {
  compeId: number
  courseId: number
  playerId: number
  umpireId: number
  point: string | null | undefined
}

export const IpponBashi = ({ compeId, courseId, playerId, umpireId, point }: IpponBashiProps) => {
  if (point === null || point === undefined) {
    return <p>loading...</p>
  }
  const initialRow = IPPON_BASHI_SIZE - 1
  const initialCol = 0
  const pointState: PointState = deserializePoint(point)
  const [result1, setResult1] = useState<number>(0) // 進んだmission
  const [result2, setResult2] = useState<number | null>(null) // 進んだmission, やり直してない場合はnull
  const [progress, setProgress] = useState<number>(0) // 今の進み具合
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [modalOpen, setModalOpen] = useState(false)
  const [pointCount, setPointCount] = useState<number | null>(0)
  const [isRetry, setIsRetry] = useState<boolean>(false)

  const [botPosition, setBotPosition] = useState({ row: initialRow, col: initialCol })

  // panelをクリックした時の挙動
  const handleNext = (row: number, col: number) => {
    // progressが既にstartに戻っている場合何もしない。
    if (progress >= (IPPON_BASHI_SIZE - 1) * 2) return

    // ポイントを加算
    // const point = calcPoint(pointState, progress + 1)
    // 独自に行きと帰りのポイントを加算
    // 行きは1点、帰りは2点
    const point: number =
      progress < IPPON_BASHI_SIZE - 1 ? (pointCount ? pointCount + 1 : 1) : pointCount ? pointCount + 2 : 1
    setPointCount(point)
    // 一回目か
    if (!isRetry) {
      setResult1(result1 + 1)
    } else if (result2 !== null) {
      // リトライか
      setResult2(result2 + 1)
    }
    // ロボットを動かす progressのIPPON_BASHI_SIZEとの大小で前進後進
    setBotPosition({
      row: progress < IPPON_BASHI_SIZE - 1 ? botPosition.row - 1 : botPosition.row + 1,
      col: botPosition.col,
    })
    setProgress(progress + 1)
  }

  // 押し間違えた時1つ前のミッションに戻る
  const handleBack = () => {
    if (!isRetry) {
      setResult1(result1 - 1)
    } else if (result2 !== null) {
      // リトライか
      setResult2(result2 - 1)
    }
    // ポイントを戻す
    // const point = calcPoint(pointState, progress - 1)
    // 独自に行きと帰りのポイントを減算
    // 行きは1点、帰りは2点
    const point: number =
      progress < IPPON_BASHI_SIZE ? (pointCount ? pointCount - 1 : 0) : pointCount ? pointCount - 2 : 0
    setPointCount(point)
    // ロボットを戻す
    setBotPosition({
      row: progress < IPPON_BASHI_SIZE ? botPosition.row + 1 : botPosition.row - 1,
      col: botPosition.col,
    })
    // progressを戻す
    setProgress(progress - 1)
  }

  // やり直しする時
  const handleRetry = () => {
    setIsRetry(true)
    setResult2(0)
    setPointCount(0)
    setProgress(0)
    setBotPosition({ row: initialRow, col: initialCol })
  }

  return (
    <div className="relative flex flex-col justify-items-center w-full h-[calc(100vh-100px)]">
      <div className="grid justify-items-center w-full">
        <p className="text-xl font-bold">THE 一本橋</p>
      </div>
      <div className="grid grid-cols-2 justify-items-center w-full h-1/2">
        <div className="flex flex-col">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title text-3xl font-bold text-orange-600">現在:</div>
              <div className="stat-value text-3xl font-bold text-orange-600">{pointCount}ポイント</div>

              <p className="text-3xl font-bold text-orange-600">{progress < IPPON_BASHI_SIZE - 1 ? "行き" : "帰り"}</p>
            </div>
          </div>
          <p className="text-lg mt-5 ml-3">パネルをタップ</p>
          <p className="text-lg ml-3">で進みます</p>
        </div>
      </div>
      <div className="grid grid-cols-2 justify-items-center w-full h-1/2">
        <div className="flex flex-col justify-items-center w-full"></div>
        <div className="flex flex-col items-end w-full">
          <button
            type="button"
            id="add"
            className="btn btn-primary mx-auto m-3"
            onClick={handleBack}
            disabled={progress === 0}>
            1つ戻る
          </button>
          <button type="button" className="btn btn-accent mx-auto m-3" onClick={() => setModalOpen(true)}>
            結果送信
          </button>
          <button type="button" className="btn btn-primary mx-auto m-3" onClick={handleRetry} disabled={isRetry}>
            やり直し
          </button>
        </div>
      </div>
      <div className="absolute flex top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <IpponBashiUI botposition={botPosition} progress={progress} onPanelClick={(row, col) => handleNext(row, col)} />
      </div>
      {modalOpen && (
        <ChallengeModal
          setModalOpen={setModalOpen}
          handleSubmit={() =>
            resultSubmit(result1, result2, compeId, courseId, playerId, umpireId, setMessage, setIsSuccess, setLoading)
          }
          loading={loading}
          isSuccess={isSuccess}
          message={message}
          result1Point={isRetry ? calcPoint(pointState, result1) : pointCount}
          result2Point={isRetry ? pointCount : null}
        />
      )}
    </div>
  )
}
type IpponBashiUIProps = {
  botposition: { row: number; col: number }
  progress: number
  onPanelClick: (row: number, col: number) => void
}

// THE一本橋を表すコンポーネント
const IpponBashiUI = (props: IpponBashiUIProps): JSX.Element => {
  const type: string = "ipponBashi"
  // 一本橋の大きさ 幅1パネル 長さ5パネル 1パネル毎の大きさ60×60
  const width: number = 1
  const length: number = IPPON_BASHI_SIZE

  const nextMissionPairMF: MissionValue[] = ["mf", 1]

  const field: FieldState = []
  for (let i = 0; i < length - 1; i++) {
    field.push(["route"])
  }
  field.push(["start"])

  const ipponBashiStyle: React.CSSProperties = {
    position: "relative",
    width: width * getPanelWidth(type) + "px",
    height: length * getPanelHeight(type) + "px",
    transform: "rotate(30deg)",
  }

  return (
    <div className={"relative grid grid-cols-" + width + " grid-rows-" + length + " mx-auto"} style={ipponBashiStyle}>
      {field.map((row, rowIndex) =>
        row.map((panel, colIndex) => (
          <Panel
            key={`${rowIndex}-${colIndex}`}
            value={panel}
            type={type}
            onClick={() => props.onPanelClick(rowIndex, colIndex)}
          />
        ))
      )}
      <>
        <Robot
          row={props.botposition.row}
          col={props.botposition.col}
          direction={props.progress < length - 1 ? "u" : "d"}
          type={type}
        />
        <NextArrow
          row={props.botposition.row}
          col={props.botposition.col}
          direction={props.progress < length - 1 ? "u" : "d"}
          nextMissionPair={nextMissionPairMF}
          duration={1.5}
          type={type}
        />
      </>
    </div>
  )
}
export default IpponBashi
