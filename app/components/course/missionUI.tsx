import { MissionState, MissionString, MissionValue, PointState, PointValue } from "@/app/components/course/util"
import { useState } from "react"

type MissionUIProps = {
  mission: MissionState
  setMission: React.Dispatch<React.SetStateAction<MissionState>>
  point: PointState
  setPoint: React.Dispatch<React.SetStateAction<PointState>>
  selectedId: number | null
  setRadio: React.Dispatch<React.SetStateAction<number | null>>
}

// 総じて同じようなプルダウンメニューが複数あるのでrefactoringの必要がある。

// ラジオボタン value=0以上の整数 はmissionの順番
// ラジオボタン value=-1 はmissionが設定されていない
// ラジオボタン value=-2 はStart
// ラジオボタン value=-3 はGoal

export const MissionUI = ({ mission, setMission, point, setPoint, selectedId, setRadio }: MissionUIProps) => {
  const [isMove, setIsMove] = useState<boolean>(false)
  const [isTurn, setIsTurn] = useState<boolean>(false)
  const [selectedMission, setSelectedMission] = useState<MissionValue | null>(null) // 選択されたミッション
  const [selectedParam, setSelectedParam] = useState<number | null>(null) // 選択されたミッションのパラメータ
  const [selectedPoint, setSelectedPoint] = useState<PointValue | null>(null)

  const handleMissionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // 「選択」に変更された場合、MissionもParamもnullにして入れられないようにする。
    // 「選択」をdisabledにすれば良いやんと思うかもしれないが、
    // リストでラジオボタンを切り替えた時の動作に不満があるので、
    // ここでhandleする。
    if (event.target.value === "0") {
      setSelectedMission(null)
      setSelectedParam(null)
      setSelectedPoint(null)
    }
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
    if (value === 0) {
      setSelectedParam(null)
    } else {
      setSelectedParam(value)
    }
  }

  const handlePointChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setSelectedPoint(value)
  }

  // UIをリセットする関数
  const resetUI = () => {
    setIsMove(false)
    setIsTurn(false)
    setSelectedMission(null)
    setSelectedParam(null)
    setSelectedPoint(null)
    setRadio(null)
  }

  // start, goalを選択しているかをチェックする関数
  const isStartGoal = () => {
    if (selectedId === -2 || selectedId === -3) return true
    return false
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.id

    if (selectedId === null) return
    const newMissionState = [...mission]
    const newPointState = [...point]

    if (isStartGoal() && selectedPoint !== null && id === "update") {
      if (selectedId === -2) {
        // Startで更新ボタン押下時
        newMissionState[0] = selectedMission
        newPointState[0] = selectedPoint
      } else {
        // Goalで更新ボタン押下時
        newMissionState[1] = selectedMission
        newPointState[1] = selectedPoint
      }
    } else if (id === "add" && selectedMission !== null && selectedParam !== null && selectedPoint !== null) {
      // 追加ボタン押下時
      if (selectedId === -1) {
        // ミッションに何も入っていない時
        newMissionState[2] = selectedMission
        newMissionState[3] = selectedParam
        newPointState[2] = selectedPoint
      } else {
        const insertIndex = 2 * selectedId + 4
        console.log("insertIndex: ", insertIndex)
        newMissionState.splice(insertIndex, 0, selectedMission, selectedParam)
        newPointState.splice(selectedId + 3, 0, selectedPoint)
      }
    } else if (
      id === "update" &&
      !isStartGoal() &&
      selectedMission !== null &&
      selectedParam !== null &&
      selectedPoint !== null &&
      selectedId !== -1
    ) {
      // 更新ボタン押下時
      newMissionState[2 * selectedId + 2] = selectedMission
      newMissionState[2 * selectedId + 3] = selectedParam
      newPointState[selectedId + 2] = selectedPoint
    } else if (id === "delete" && selectedId !== -1) {
      // 削除ボタン押下時
      newMissionState.splice(2 * selectedId + 2, 2)
      newPointState.splice(selectedId + 2, 1)
    }
    console.log(newMissionState)
    console.log(newPointState)
    setMission(newMissionState)
    setPoint(newPointState)
    resetUI()
  }

  return (
    <div>
      <div>MissionUI</div>
      <div className="container">
        <label className="label">
          {selectedId === -2
            ? "スタートの向き"
            : selectedId === -3
            ? "ゴールの向き"
            : selectedId === null
            ? "上のいずれかを選択してください"
            : "ミッション選択"}
        </label>
        <div className="flex justify-start">
          {isStartGoal() ? (
            <select className="select select-bordered" defaultValue={0} onChange={handleMissionChange}>
              {/* ここでdisabledにしておくとmissionListでラジオボタン切り替えた際にdefaultが選択してくださいにならないのが気に食わないので、disabledにしない */}
              {/* <option disabled value={0}> */}
              <option value={0}>選択してください</option>
              {(["u", "r", "d", "l"] as Exclude<MissionValue, null>[]).map((value) => (
                <option key={value} value={value}>
                  {MissionString[value]}
                </option>
              ))}
            </select>
          ) : selectedId === null ? null : (
            <>
              <select className="select select-bordered" defaultValue={0} onChange={handleMissionChange}>
                {/* ここでdisabledにしておくとmissionListでラジオボタン切り替えた際にdefaultが選択してくださいにならないのが気に食わないので、disabledにしない */}
                {/* <option disabled value={0}>
                  選択
                </option> */}
                <option value={0}>選択</option>
                {(["mf", "mb", "tr", "tl"] as Exclude<MissionValue, null>[]).map((value) => (
                  <option key={value} value={value}>
                    {MissionString[value]}
                  </option>
                ))}
              </select>
              {isMove ? (
                <>
                  <select className="select select-bordered ml-2" defaultValue={0} onChange={handleParamChange}>
                    <option disabled value={0}>
                      選択
                    </option>
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <p className="self-center ml-2">パネル</p>
                </>
              ) : isTurn ? (
                <>
                  <select className="select select-bordered ml-2" defaultValue={0} onChange={handleParamChange}>
                    <option disabled value={0}>
                      選択
                    </option>
                    {[90, 180, 270, 360, 450, 540].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <p className="self-center ml-2">度</p>
                </>
              ) : (
                <p className="self-center">{"<"}-選択してください</p>
              )}
            </>
          )}
          {(isStartGoal() && selectedMission !== null) ||
          (!isStartGoal() && selectedMission !== null && selectedParam !== null) ? (
            <>
              <select className="select select-bordered ml-2" defaultValue={0} onChange={handlePointChange}>
                <option disabled value={0}>
                  選択
                </option>
                {[0, 1, 2, 3, 4, 5, 6, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <p className="self-center ml-2">ポイント</p>
            </>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div></div>
        <button
          type="button"
          id="add"
          className="btn btn-primary mx-auto"
          disabled={isStartGoal() || selectedId === null}
          onClick={handleButtonClick}>
          追加
        </button>
        <button
          type="button"
          id="update"
          className="btn btn-primary mx-auto"
          onClick={handleButtonClick}
          disabled={selectedId === null || selectedId === -1}>
          更新
        </button>
        <button
          type="button"
          id="delete"
          className="btn btn-warning mx-auto"
          onClick={handleButtonClick}
          disabled={isStartGoal() || selectedId === null}>
          削除
        </button>
      </div>
    </div>
  )
}