"use client"

import type { SelectCourse } from "@/app/lib/db/schema"
import { useState } from "react"
import { CourseList } from "@/app/components/course/courseList"
import { useRouter } from "next/navigation"

type ChallengeListProps = {
  courseDataList: { selectCourses: SelectCourse[] }
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export const ChallengeList = ({ courseDataList, setStep }: ChallengeListProps) => {
  const [selectedIds, setSelectedIds] = useState<number | null>(null)
  const router = useRouter()

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(Number(event.target.value))
  }

  const handleClickButton = () => {
    // if (selectedIds !== null) {
    //   router.push(`/challenge/${selectedIds}`)
    // }
    setStep(1)
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
        courseData={courseDataList}
        inputType="radio"
        handleInputChange={handleRadioChange}
        checkedIds={selectedIds !== null ? [selectedIds] : []} // selectedIdsを配列に変換する
        loading={false}
      />
    </>
  )
}
