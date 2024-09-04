"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import CourseEdit from "@/app/course/edit/courseEdit"
import MissionEdit from "@/app/course/edit/missionEdit"
import { initializeField, deserializeField, FieldState } from "@/app/components/course/util"
import { getCourse } from "@/app/course/listUtils"
import { finModal, saveModal } from "@/app/components/course/modals"
import { Container } from "postcss"

export default function Edit() {
  const searchParams = useSearchParams()
  const [isMissionEdit, setIsMissionEdit] = useState(false)
  const [modalOpen, setModalOpen] = useState(0)
  const [field, setField] = useState<FieldState>(initializeField())
  const [mission, setMission] = useState<string>("")
  const [point, setPoint] = useState<string>("")
  const [name, setName] = useState<string>("")

  useEffect(() => {
    async function fetchCourseData() {
      const id = Number(searchParams.get("id"))
      if (id) {
        const course = await getCourse(id)
        if (course) {
          if (course.field) setField(deserializeField(course.field))
          if (course.mission) setMission(course.mission)
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
      {/* isMissionEditは要らないかもしれない。 */}
      {/* {isMissionEdit ? ( */}
      <div className="container w-full h-full max-h-screen grid grid-cols-2 gap-4">
        <div>
          {/* <div className="max-w-lg max-h-screen overflow-auto p-4"> */}
          <CourseEdit field={field} setField={setField} />
        </div>
        <div>
          <MissionEdit mission={mission} setMission={setMission} point={point} setPoint={setPoint} />
        </div>
      </div>
      <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleButtonClick(2)}>
        コースを保存
      </button>
      <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => setIsMissionEdit(!isMissionEdit)}>
        {isMissionEdit ? "ミッション編集を終了" : "ミッション編集"}
      </button>
      <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleButtonClick(1)}>
        一覧に戻る
      </button>

      {modalOpen === 1 && finModal({ setModalOpen })}
      {modalOpen === 2 && saveModal({ setModalOpen, name, setName, field })}
    </>
  )
}
