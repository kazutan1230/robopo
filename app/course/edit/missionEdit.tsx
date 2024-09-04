import { useEffect, useState } from "react"
import { MissionUI } from "@/app/components/course/missionUI"
import { MissionList } from "@/app/components/course/missionList"
import { MissionState, deserializeMission } from "@/app/components/course/util"

type MissionEditProps = {
  mission: string
  setMission: React.Dispatch<React.SetStateAction<string>>
  point: string
  setPoint: React.Dispatch<React.SetStateAction<string>>
}

export default function MissionEdit({ mission, setMission, point, setPoint }: MissionEditProps) {
  const initMission = deserializeMission(mission)

  const [missionState, setMissionState] = useState<MissionState>(initMission)

  const [radio, setRadio] = useState<number | null>(null)

  // ラジオボタンを押した時の動作
  // ラジオボタン value=0以上の整数 はmissionの順番
  // ラジオボタン value=-1 はmissionが設定されていない
  // ラジオボタン value=-2 はStart
  // ラジオボタン value=-3 はGoal

  return (
    <div className="max-h-screen overflow-auto p-4">
      <div>
        <MissionList
          missionState={missionState}
          point={point}
          radio={radio}
          setRadio={setRadio}
          setMission={setMission}
          setPoint={setPoint}
        />
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
