'use client'

import { useState } from "react"
import List from "@/app/course/list"
import CourseEdit from "@/app/course/courseEdit"
import MissionEdit from "@/app/course/missionEdit"

export default function Course() {

  const [isEdit, setIsEdit] = useState(false)
  const [isMissionEdit, setIsMissionEdit] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  type ModalProps = {
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  // 保存するかどうか聞くmodal
  const saveModal = ({ modalOpen, setModalOpen }: ModalProps) => {
    const handleYes = () => {
      setModalOpen(false)
      setIsEdit(false)
      setIsMissionEdit(false)
    }

    const handleNo = () => {
      setModalOpen(false)
      setIsEdit(false)
    }

    const handleCancel = () => {
      setModalOpen(false)
    }

    return (
      <dialog id="save-modal"
        className={`modal modal- ${modalOpen ? 'modal-open' : ''}`}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal-box">
          <p>保存しますか?しない場合、編集内容は失われます。</p>
          <div className="modal-action">
            <button
              className="btn btn-accent"
            >はい</button>
            <button
              className="btn"
              onClick={handleNo}
            >いいえ</button>
            <button
              className="btn"
              onClick={handleCancel}
            >キャンセル</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
          <button>close</button>
        </form>
      </dialog>
    )
  }

  // コース編集ボタンクリック
  const handleCourseEditClick = () => {
    if (isEdit) {
      setModalOpen(true)
    }else {
      setIsEdit(true)
    }
  }

  return (
    <>
    {isEdit && isMissionEdit && <MissionEdit />}
    {isEdit && !isMissionEdit && <CourseEdit />}
    {!isEdit && <List />}

    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleCourseEditClick()}>
      {isEdit ? 'コース編集を終了' : 'コース編集'}
    </button>
    <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => setIsMissionEdit(!isMissionEdit)}>
      {isMissionEdit ? 'ミッション編集を終了' : 'ミッション編集'}
    </button>

    {saveModal({ modalOpen, setModalOpen })}
  </>
  )
}
