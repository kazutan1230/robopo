"use client"

import type { SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"
import { getCourseList } from "@/app/course/listUtils"
import { CourseList } from "@/app/components/course/courseList"
import { useRouter } from "next/navigation"

export const ChallengeList = () => {
  const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] }>({ selectCourses: [] })
  const [selectedIds, setSelectedIds] = useState<number | null>(null)
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

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(Number(event.target.value))
  }

  const handleClickButton = () => {
    if (selectedIds !== null) {
      router.push(`/challenge/${selectedIds}`)
    }
  }

  return (
    <>
      <div className="grid grid-cols-3">
        <div className="self-center mx-4">
          <p>コースを選んでください</p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" disabled={selectedIds === null} onClick={handleClickButton}>
            選手登録へ
          </button>
        </div>
      </div>
      <CourseList
        courseData={courseData}
        inputType="radio"
        handleInputChange={handleRadioChange}
        checkedIds={selectedIds !== null ? [selectedIds] : []} // selectedIdsを配列に変換する
        loading={loading}
      />
    </>
  )
}
