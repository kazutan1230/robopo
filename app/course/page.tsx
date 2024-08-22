'use client'

import Link from "next/link"
import { useState } from "react"
import List from "@/app/course/list"
import CourseEdit from "@/app/course/courseEdit"
import MissionEdit from "@/app/course/missionEdit"

export default function Course() {

  const [isEdit, setIsEdit] = useState(false)
  const [isMissionEdit, setIsMissionEdit] = useState(false)

  return (
    <>
    {isEdit && isMissionEdit && <MissionEdit />}
    {isEdit && !isMissionEdit && <CourseEdit />}
    {!isEdit && <List />}

    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => setIsEdit(!isEdit)}>
      {isEdit ? 'コース編集を終了' : 'コース編集'}
    </button>
    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => setIsMissionEdit(!isMissionEdit)}>
      {isMissionEdit ? 'ミッション編集を終了' : 'ミッション編集'}
    </button>
  </>
  )
}
