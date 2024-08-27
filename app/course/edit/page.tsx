'use client'
// 既存コースの編集の時、既存コースをDBから読み込む処理が必要やけど、
// use clientのままでは多分、無理、useState使ってるから、
// useState使ってるとこだけ分離できたらして。

import { useState } from "react"
import Link from "next/link"
import CourseEdit from "@/app/course/edit/courseEdit"
import MissionEdit from "@/app/course/edit/missionEdit"
import { initializeField, FieldState } from "@/app/components/course/util"
import { finModal, saveModal } from "@/app/components/course/modals"

export default function Edit() {

  const [isEdit, setIsEdit] = useState(false)
  const [isMissionEdit, setIsMissionEdit] = useState(false)
  const [modalOpen, setModalOpen] = useState(0)
  const [field, setField] = useState<FieldState>(initializeField())
  const [name, setName] = useState<string>("")
  
  // コース編集ボタンクリック
  const handleCourseEditClick = () => {
    if (isEdit) {
      setModalOpen(1)
    }else {
      setIsEdit(true)
    }
  }

  return (
    <>
    {isEdit && isMissionEdit && <MissionEdit />}
    {isEdit && !isMissionEdit && <CourseEdit field={field} setField={setField}/>}
    {/* {!isEdit && <List />} */}

    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleCourseEditClick()}>
      {isEdit ? 'コース編集を終了' : 'コース編集'}
    </button>
    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => setIsMissionEdit(!isMissionEdit)}>
      {isMissionEdit ? 'ミッション編集を終了' : 'ミッション編集'}
    </button>
    <Link href="/course" className="btn btn-primary min-w-28 max-w-fit mx-auto" >一覧に戻る</Link>


    { modalOpen === 1 && finModal({ setModalOpen, setIsEdit }) }
    { modalOpen === 2 && saveModal({ setModalOpen, setIsEdit, name, setName, field }) }
    {/* { modalOpen === 2 && saveModal({ setModalOpen, setIsEdit, name, setName, field, successOrNot, setSuccessOrNot }) } */}
    {/* {successOrNot !== null &&
                    <div role="alert" className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successOrNot}</span>
                    </div>
                } */}
    </>
  )
}
