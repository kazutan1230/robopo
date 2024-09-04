import { useEffect, useState } from "react"
import { MissionUI } from "@/app/components/course/missionUI"
import {
  MissionState,
  deserializeMission,
  serializeMission,
  MissionString,
  MissionValue,
  missionStatePair,
} from "@/app/components/course/util"

type MissionEditProps = {
  mission: string
  setMission: React.Dispatch<React.SetStateAction<string>>
  point: string
  setPoint: React.Dispatch<React.SetStateAction<string>>
}

export default function MissionEdit({ mission, setMission, point, setPoint }: MissionEditProps) {
  const initMission = deserializeMission(mission)

  const [missionState, setMissionState] = useState<MissionState>(initMission)
  const [statePair, setMissionStatePair] = useState<MissionValue[][]>(missionStatePair(initMission))

  const [radio, setRadio] = useState<number | null>(null)

  useEffect(() => {
    setMissionStatePair(missionStatePair(missionState))
  }, [missionState])

  // ラジオボタンを押した時の動作
  // ラジオボタン value=0以上の整数 はmissionの順番
  // ラジオボタン value=-1 はmissionが設定されていない
  // ラジオボタン value=-2 はStart
  // ラジオボタン value=-3 はGoal
  const handleRadioChange = (selectedIndex: number) => {
    setRadio(selectedIndex) // 選択されたインデックスを状態として保存
    console.log("Selected mission index:", selectedIndex)
  }

  return (
    <div className="max-w-lg max-h-screen overflow-auto p-4">
      <div>MissionEdit</div>
      <div className="form-control overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input type="radio" name="radio-1" className="radio" disabled />
              </th>
              <th>順番</th>
              <th>ミッション</th>
              <th>ポイント</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover cursor-pointer" onClick={() => handleRadioChange(-2)}>
              <th>
                <input type="radio" name="radio-1" className="radio" value={-2} checked={radio === -2} readOnly />
              </th>
              <td>Start</td>
              {/* ちょっとこの辺実際にmission入れてから動作見たい。 */}
              {missionState[0] === null ? <td>-</td> : <td>{MissionString[missionState[0]]}</td>}
              <td>-</td>
            </tr>
            {statePair.length > 0 ? (
              // 最後の要素をここでrenderしないようにするつもり、
              // sliceの第二引数が最後のrenderを指定しているようだが、
              // -1か-2かどっちなのか分からんので、追々、修正すること。
              statePair.map((mission, index) => (
                // statePair.slice(0, -1).map((mission, index) => (
                <tr className="hover cursor-pointer" onClick={() => handleRadioChange(index)} key={index}>
                  <th>
                    <input
                      type="radio"
                      name="radio-1"
                      className="radio"
                      value={index}
                      checked={radio === index}
                      readOnly
                    />
                  </th>
                  <td>{index + 1}</td>
                  <td>
                    {mission[0] === null ? "-" : MissionString[mission[0]]}
                    {mission[1] === null ? "-" : mission[1]}
                    {mission[0] === "mf" || mission[0] === "mb"
                      ? "パネル"
                      : mission[0] === "tr" || mission[0] === "tl"
                      ? "度"
                      : "-"}
                  </td>
                  <td>-</td>
                </tr>
              ))
            ) : (
              // row 2
              <tr className="hover cursor-pointer" onClick={() => handleRadioChange(-1)}>
                <th>
                  <input type="radio" name="radio-1" className="radio" value={-1} checked={radio === -1} readOnly />
                </th>
                <td>-</td>
                <td>ミッションを追加してください。</td>
                <td>-</td>
              </tr>
            )}
            <tr className="hover cursor-pointer" onClick={() => handleRadioChange(-3)}>
              <th>
                <input type="radio" name="radio-1" className="radio" value={-3} checked={radio === -3} readOnly />
              </th>
              <td>Goal</td>
              {/* ちょっとこの辺実際にmission入れてから動作見たい。 */}
              {/* {<td>{MissionString ? [missionState[missionState.length - 1]] : "-"}</td>} */}
              {missionState[missionState.length - 1] === null ? (
                <td>-</td>
              ) : (
                <td>{MissionString ? [missionState[missionState.length - 1]] : "-"}</td>
              )}
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div />
      <div>
        <MissionUI
          missionState={missionState}
          setMissionState={setMissionState}
          selectedId={radio}
          setRadio={setRadio}
        />
      </div>
    </div>
  )
}
