"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import CourseEdit from "@/app/course/edit/courseEdit"
import MissionEdit from "@/app/course/edit/missionEdit"
import {
  initializeField,
  deserializeField,
  FieldState,
  deserializeMission,
  MissionState,
} from "@/app/components/course/util"
import { getCourse } from "@/app/course/listUtils"
import { finModal, saveModal } from "@/app/components/course/modals"

export default function Edit() {
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(0)
  const [field, setField] = useState<FieldState>(initializeField())
  const [mission, setMission] = useState<MissionState>([])
  const [point, setPoint] = useState<string>("")
  const [name, setName] = useState<string>("")

  useEffect(() => {
    async function fetchCourseData() {
      const id = Number(searchParams.get("id"))
      if (id) {
        const course = await getCourse(id)
        if (course) {
          if (course.field) setField(deserializeField(course.field))
          if (course.mission) setMission(deserializeMission(course.mission))
          if (course.point) setPoint(course.point)
          if (course.name) setName(course.name)
        }
      }
    }
    fetchCourseData()
  }, [searchParams])

  const handleButtonClick = (id: number) => {
    setModalOpen(id)
  }

  return (
    <>
      <div className="h-screen">
        <div className="container w-full sm:max-h-screen sm:grid sm:grid-cols-2 gap-4">
          <div>
            <CourseEdit field={field} setField={setField} />
          </div>
          <div>
            <MissionEdit mission={mission} setMission={setMission} point={point} setPoint={setPoint} />
          </div>
        </div>
        <div className="flex mx-auto p-4 mt-0 gap-4">
          <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleButtonClick(2)}>
            コースを保存
          </button>
          <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleButtonClick(1)}>
            一覧に戻る
          </button>
        </div>
      </div>

      {modalOpen === 1 && finModal({ setModalOpen })}
      {modalOpen === 2 && saveModal({ setModalOpen, name, setName, field, mission })}
    </>
  )
}
