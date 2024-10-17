"use client"
import { type CourseSummary, isCompletedCourse } from "@/app/components/summary/utils"
import { getCourseList } from "@/app/components/course/listUtils"
import { deserializePoint, PointValue } from "@/app/components/course/utils"
import { calcPoint } from "@/app/components/challenge/utils"
import { type SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"
import Link from "next/link"

export const SummaryTable = () => {
  const competitionId: number = 1 //一旦1
  const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] }>({ selectCourses: [] })
  const [pointData, setPointData] = useState<PointValue[]>([])
  const [ipponBashiPoint, setIpponBashiPoint] = useState<PointValue[]>([])
  const [courseId, setCourseId] = useState<number | null>(0)
  const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コースリストを取得
        const newCourseData: { selectCourses: SelectCourse[] } = await getCourseList()
        setCourseData(newCourseData)

        const newIpponBashiPoint = newCourseData.selectCourses.find((course) => course.id === -1)?.point
        newIpponBashiPoint && setIpponBashiPoint(await deserializePoint(newIpponBashiPoint))

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
            courseData.selectCourses.map(
              (course) =>
                course.id !== -1 &&
                course.id !== -2 && (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                )
            )
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
              <th className="border border-gray-400 p-2">ふりがな</th>
              <th className="border border-gray-400 p-2">ゼッケン</th>
              <th className="border border-gray-400 p-2">Tコース完走なら〇記入</th>
              <th className="border border-gray-400 p-2">完走は何回で達成?</th>
              <th className="border border-gray-400 p-2">Tコースの最高得点</th>
              <th className="border border-gray-400 p-2">センサーコースの最高得点</th>
              <th className="border border-gray-400 p-2">一本橋の最高得点</th>
              <th className="border border-gray-400 p-2">全てのチャレンジの総得点</th>
              <th className="border border-gray-400 p-2">総得点の順位</th>
              <th className="border border-gray-400 p-2">チャレンジ回数</th>
              <th className="border border-gray-400 p-2">回数の順位</th>
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
                  <td className="border border-gray-400 p-2">
                    <Link
                      href={`/summary/${competitionId}/${courseId}/${player.playerId}`}
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
                      {player.playerName ? player.playerName : "-"}
                    </Link>
                  </td>
                  <td className="border border-gray-400 p-2">{player.playerFurigana ? player.playerFurigana : "-"}</td>
                  <td className="border border-gray-400 p-2">{player.playerZekken ? player.playerZekken : "-"}</td>
                  <td className="border border-gray-400 p-2">
                    {isCompletedCourse(pointData, player.tCourseMaxResult) ? "〇" : "-"}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {isCompletedCourse(pointData, player.tCourseMaxResult) && player.firstTCourseCount
                      ? player.firstTCourseCount
                      : "-"}
                  </td>
                  {/* センサーコース以外 */}
                  {courseId !== -2 && (
                    <td className="border border-gray-400 p-2">
                      {player.tCourseMaxResult ? calcPoint(pointData, player.tCourseMaxResult) : "-"}
                    </td>
                  )}
                  {/* センサーコースはmaxResultに最高得点が入る */}
                  {courseId === -2 && (
                    <td className="border border-gray-400 p-2">
                      {player.sensorMaxResult ? player.sensorMaxResult : "-"}
                    </td>
                  )}
                  <td className="border border-gray-400 p-2">
                    {player.sensorMaxResult ? player.sensorMaxResult : "-"}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {player.ipponMaxResult ? calcPoint(ipponBashiPoint, player.ipponMaxResult) : "-"}
                  </td>
                  <td className="border border-gray-400 p-2">{player.totalPoint ? player.totalPoint : "-"}</td>
                  <td className="border border-gray-400 p-2">{player.pointRank}</td>
                  <td className="border border-gray-400 p-2">{player.challengeCount}</td>
                  <td className="border border-gray-400 p-2">{player.challengeRank}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-gray-400 p-2 text-center">
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
