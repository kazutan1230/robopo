import { MissionState, MissionString, MissionValue } from "@/app/components/course/util"
import { useState } from "react"

type MissionUIProps = {
  missionState: MissionState
  setMissionState: React.Dispatch<React.SetStateAction<MissionState>>
  selectedId: number | null
  setRadio: React.Dispatch<React.SetStateAction<number | null>>
}

// 総じて同じようなプルダウンメニューが複数あるのでrefactoringの必要がある。

// ラジオボタン value=0以上の整数 はmissionの順番
// ラジオボタン value=-1 はmissionが設定されていない
// ラジオボタン value=-2 はStart
// ラジオボタン value=-3 はGoal

export const MissionUI = ({ missionState, setMissionState, selectedId, setRadio }: MissionUIProps) => {
  const [isMove, setIsMove] = useState<boolean>(false)
  const [isTurn, setIsTurn] = useState<boolean>(false)
  const [selsectedMission, setSelectedMission] = useState<MissionValue | null>(null) // 選択されたミッション
  const [selectedParam, setSelectedParam] = useState<number | null>(null) // 選択されたミッションのパラメータ

  const handleMoveTurnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as MissionValue

    setSelectedMission(value)
    if (value === "mf" || value === "mb") {
      setIsMove(true)
      setIsTurn(false)
    } else if (value === "tr" || value === "tl") {
      setIsTurn(true)
      setIsMove(false)
    } else {
      setIsMove(false)
      setIsTurn(false)
    }
  }

  const handleParamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setSelectedParam(value)
  }

  // UIをリセットする関数
  const resetUI = () => {
    setIsMove(false)
    setIsTurn(false)
    setSelectedMission(0)
    setSelectedParam(0)
    setRadio(null)
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.id
    // console.log("id", id)

    if (selectedId === null) return
    const newMissionState = [...missionState]

    if (id === "add" && selsectedMission !== null && selectedParam !== null) {
      // 追加ボタン押下時
      const insertIndex = 2 * selectedId + 3
      newMissionState.splice(insertIndex, 0, selsectedMission, selectedParam)
      setMissionState(newMissionState)
      resetUI()
    } else if (id === "update" && selsectedMission !== null && selectedParam !== null && selectedId !== -1) {
      // 更新ボタン押下時
      newMissionState[2 * selectedId + 1] = selsectedMission
      newMissionState[2 * selectedId + 2] = selectedParam
      setMissionState(newMissionState)
      resetUI()
    } else if (id === "delete" && selectedId !== -1) {
      // 削除ボタン押下時
      newMissionState.splice(2 * selectedId + 1, 2)
      setMissionState(newMissionState)
      resetUI()
    }
  }

  return (
    <div>
      <div>MissionUI</div>
      <div className="container grid grid-cols-3">
        <label className="col-span-3 label">
          {selectedId === -2
            ? "スタートの向き"
            : selectedId === -3
            ? "ゴールの向き"
            : selectedId === null
            ? "上のいずれかを選択してください"
            : "ミッション選択"}
        </label>
        {selectedId === -2 || selectedId === -3 ? (
          <select className="col-span-3 select select-bordered" defaultValue={0}>
            <option disabled value={0}>
              選択してください
            </option>
            {(["u", "r", "d", "l"] as Exclude<MissionValue, null>[]).map((value) => (
              <option key={value} value={value}>
                {MissionString[value]}
              </option>
            ))}
          </select>
        ) : selectedId === null ? (
          <p>上のいずれかを選択してください</p>
        ) : (
          <>
            <select className="select select-bordered" defaultValue={0} onChange={handleMoveTurnChange}>
              <option disabled value={0}>
                選択してください
              </option>
              {(["mf", "mb", "tr", "tl"] as Exclude<MissionValue, null>[]).map((value) => (
                <option key={value} value={value}>
                  {MissionString[value]}
                </option>
              ))}
            </select>
            {isMove ? (
              <>
                <select className="select select-bordered" defaultValue={0} onChange={handleParamChange}>
                  <option disabled value={0}>
                    選択してください
                  </option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <p className="self-center">パネル</p>
              </>
            ) : isTurn ? (
              <>
                <select className="select select-bordered" defaultValue={0} onChange={handleParamChange}>
                  <option disabled value={0}>
                    選択してください
                  </option>
                  {[90, 180, 270, 360, 450, 540].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <p className="self-center">度</p>
              </>
            ) : (
              <p className="col-span-2 self-center">{"<"}-選択してください</p>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-4">
        <div></div>
        <button
          type="button"
          id="add"
          className="btn btn-primary mx-auto"
          //   disabled={checkedCount === 1 ? false : true}
          onClick={handleButtonClick}>
          追加
        </button>
        <button
          type="button"
          id="update"
          className="btn btn-primary mx-auto"
          onClick={handleButtonClick}
          //   disabled={checkedCount === 1 ? false : true}
        >
          更新
        </button>
        <button
          type="button"
          id="delete"
          className="btn btn-warning mx-auto"
          onClick={handleButtonClick}
          //   disabled={checkedCount === 0 ? true : false}
        >
          削除
        </button>
      </div>
    </div>
  )
}
