"use client"
import { type CourseSummary, calcPoint } from "@/app/components/summary/utils"
import { getCourseList } from "@/app/components/course/listUtils"
import { deserializePoint, PointValue } from "@/app/components/course/utils"
import { type SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"

export const SummaryTable = () => {
  const competitionId: number = 1 //一旦1
  const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] }>({ selectCourses: [] })
  const [pointData, setPointData] = useState<PointValue[]>([])
  const [courseId, setCourseId] = useState<number | null>(0)
  const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コースリストを取得
        const newCourseData: { selectCourses: SelectCourse[] } = await getCourseList()
        setCourseData(newCourseData)

        // コースIDが選択されている場合、そのコースのデータを取得
        if (courseId !== null) {
          const selectedCourse = courseData.selectCourses.find((course) => course.id === courseId)
          if (selectedCourse) {
            const point = await deserializePoint(selectedCourse.point)
            setPointData(point)
          }
          const res = await fetch(`/api/summary/${competitionId}/${courseId}`, { cache: "no-store" })
          const data = await res.json()
          setCourseSummary(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [competitionId, courseId])

  return (
    <>
      <div className="flex mb-5">
        <h1 className="text-3xl font-bold mr-5 mt-2">成績判定シート</h1>
        <select
          className="select select-bordered"
          onChange={(event) => setCourseId(Number(event.target.value))}
          defaultValue={0}>
          <option value={0} disabled>
            コースを選んでください
          </option>
          {courseData ? (
            courseData.selectCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))
          ) : (
            <option>コースがありません</option>
          )}
        </select>
      </div>
      <div className="flex justify-center">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2">名前</th>
              <th className="border border-gray-400 p-2">ゼッケン</th>
              <th className="border border-gray-400 p-2">最高得点</th>
              <th className="border border-gray-400 p-2">チャレンジ回数</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <span className="loading loading-spinner text-info"></span>
                </td>
              </tr>
            ) : courseSummary.length > 0 ? (
              courseSummary.map((player) => (
                <tr key={player.playerId}>
                  <td className="border border-gray-400 p-2">{player.playerName}</td>
                  <td className="border border-gray-400 p-2">{player.playerZekken}</td>
                  <td className="border border-gray-400 p-2">{calcPoint(pointData, player.maxResult)}</td>
                  <td className="border border-gray-400 p-2">{player.challengeCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-400 p-2 text-center">
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
