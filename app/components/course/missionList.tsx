import { useEffect, useState } from "react"
import {
  MissionState,
  MissionString,
  MissionValue,
  PointState,
  missionStatePair,
  panelOrDegree,
} from "@/app/components/course/utils"

type MissionEditProps = {
  mission: MissionState
  point: PointState
  radio: number | null
  setRadio: React.Dispatch<React.SetStateAction<number | null>>
}
export const MissionList = ({ mission, point, radio, setRadio }: MissionEditProps) => {
  const [statePair, setMissionStatePair] = useState<MissionValue[][]>(missionStatePair(mission))

  useEffect(() => {
    const newStatePair = missionStatePair(mission)
    setMissionStatePair(newStatePair)
  }, [mission])

  // ラジオボタンを押した時の動作
  // ラジオボタン value=0以上の整数 はmissionの順番
  // ラジオボタン value=-1 はmissionが設定されていない
  // ラジオボタン value=-2 はStart
  // ラジオボタン value=-3 はGoal
  const handleRadioChange = (selectedIndex: number) => {
    setRadio(selectedIndex) // 選択されたインデックスを状態として保存
  }

  return (
    <div className="w-full max-h-64 overflow-auto p-4">
      <div>MissionEdit</div>
      <div className="form-control">
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
              {mission[0] === null || mission[0] === undefined || mission[0] === "" ? (
                <td>-</td>
              ) : (
                <td>{MissionString[mission[0]]}</td>
              )}
              <td>{point[0]}</td>
            </tr>
            {statePair.length > 0 ? (
              statePair.map((mission, index) => (
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
                    {panelOrDegree(mission[0])}
                  </td>
                  <td>{point[index + 2]}</td>
                </tr>
              ))
            ) : (
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
              {mission[1] === null || mission[1] === undefined || mission[1] === "" ? (
                <td>-</td>
              ) : (
                <td>{MissionString[mission[1]]}</td>
              )}
              <td>{point[1]}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div />
    </div>
  )
}
