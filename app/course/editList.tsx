"use client"

import type { SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"
import { getCourseList, deleteCourse } from "@/app/course/listUtils"
import { CourseList } from "@/app/components/course/courseList"
import { useRouter } from "next/navigation"

export const EditList = () => {
  const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] }>({ selectCourses: [] })
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const newCourseData: { selectCourses: SelectCourse[] } = await getCourseList()
      setCourseData(newCourseData)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target
    const id = Number(value)
    let updatedCheckedIds = [...checkedIds]

    if (checked) {
      updatedCheckedIds.push(id)
    } else {
      updatedCheckedIds = updatedCheckedIds.filter((selectedId) => selectedId !== id)
    }

    setCheckedIds(updatedCheckedIds)
  }

  const handleEdit = () => {
    router.push(`/course/edit?id=${checkedIds[0]}`)
  }

  const formAction = async (formData: FormData) => {
    const result = await deleteCourse(formData)
    const newCourseData: { selectCourses: SelectCourse[] } = await getCourseList()
    setCourseData(newCourseData)
    setCheckedIds([])
    alert(result.message)
  }

  return (
    <>
      <form action={formAction}>
        <div className="grid grid-cols-3">
          <div className="self-center mx-4">
            <p>選択したコースを</p>
          </div>
          <div>
            <button type="button" className="btn btn-primary" disabled={checkedIds.length !== 1} onClick={handleEdit}>
              編集
            </button>
          </div>
          <div>
            <button type="submit" className="btn btn-warning" disabled={checkedIds.length === 0}>
              削除
            </button>
          </div>
        </div>

        <CourseList
          courseData={courseData}
          inputType="checkbox"
          handleInputChange={handleCheckboxChange}
          checkedIds={checkedIds}
          loading={loading}
        />
      </form>
    </>
  )
}
