"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import CourseEdit from "@/app/course/edit/courseEdit"
import MissionEdit from "@/app/course/edit/missionEdit"
import { initializeField, deserializeField, FieldState } from "@/app/components/course/util"
import { getCourse } from "@/app/course/listUtils"
import { finModal, saveModal } from "@/app/components/course/modals"

export default function Edit() {
    const searchParams = useSearchParams()
    const [isMissionEdit, setIsMissionEdit] = useState(false)
    const [modalOpen, setModalOpen] = useState(0)
    const [field, setField] = useState<FieldState>(initializeField())
    const [name, setName] = useState<string>("")

    useEffect(() => {
        async function fetchCourseData() {
            const id = Number(searchParams.get("id"))
            if (id) {
                const course = await getCourse(id)
                if (course) {
                    if (course.field) setField(deserializeField(course.field))
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
            {isMissionEdit ? (
                <div className="grid grid-cols-2">
                    <div>
                        <CourseEdit field={field} setField={setField} />
                    </div>
                    <div>
                        <MissionEdit />
                    </div>
                </div>
            ) : (
                <CourseEdit field={field} setField={setField} />
            )}
            <button className="btn btn-primary min-w-28 max-w-fit mx-auto" onClick={() => handleButtonClick(2)}>
                コースを保存
            </button>
            <button
                className="btn btn-primary min-w-28 max-w-fit mx-auto"
                onClick={() => setIsMissionEdit(!isMissionEdit)}>
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
