import { useState } from "react"
import { MissionUI } from "@/app/components/course/missionUI"
import { MissionList } from "@/app/components/course/missionList"
import { MissionState } from "@/app/components/course/util"

type MissionEditProps = {
  mission: MissionState
  setMission: React.Dispatch<React.SetStateAction<MissionState>>
  point: string
  setPoint: React.Dispatch<React.SetStateAction<string>>
}

export default function MissionEdit({ mission, setMission, point, setPoint }: MissionEditProps) {
  const [radio, setRadio] = useState<number | null>(null)

  // ラジオボタンを押した時の動作
  // ラジオボタン value=0以上の整数 はmissionの順番
  // ラジオボタン value=-1 はmissionが設定されていない
  // ラジオボタン value=-2 はStart
  // ラジオボタン value=-3 はGoal

  return (
    <div className="container mx-auto">
      <div className="card bg-base-100 w-full min-w-72 shadow-xl">
        <div className="card-body">
          <MissionList
            mission={mission}
            point={point}
            radio={radio}
            setRadio={setRadio}
            // setPoint={setPoint}
          />
        </div>
      </div>
      <div className="card bg-base-100 w-full min-w-72 shadow-xl">
        <div className="card-body">
          <MissionUI mission={mission} setMission={setMission} selectedId={radio} setRadio={setRadio} />
        </div>
      </div>
    </div>
  )
}
