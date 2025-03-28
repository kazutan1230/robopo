"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { type CourseSummary, isCompletedCourse } from "@/app/components/summary/utils"
import { getCourseList } from "@/app/components/course/listUtils"
import { deserializePoint, PointValue } from "@/app/components/course/utils"
import { calcPoint } from "@/app/components/challenge/utils"
import { type SelectCourse } from "@/app/lib/db/schema"

export const SummaryTable = () => {
  const competitionId: number = 1 //一旦1
  const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] }>({ selectCourses: [] })
  const [pointData, setPointData] = useState<PointValue[]>([])
  const [ipponBashiPoint, setIpponBashiPoint] = useState<PointValue[]>([])
  const [courseId, setCourseId] = useState<number | null>(0)
  const [courseSummary, setCourseSummary] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [sortKey, setSortKey] = useState<string>("") // ソートする列名
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc") // 昇順・降順

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コースリストを取得
        const newCourseData: { selectCourses: SelectCourse[] } = await getCourseList()
        setCourseData(newCourseData)

        const newIpponBashiPoint = newCourseData.selectCourses.find((course) => course.id === -1)?.point
        newIpponBashiPoint && setIpponBashiPoint(await deserializePoint(newIpponBashiPoint))

        // コースIDが選択されている場合、そのコースのデータを取得
        // コースIDが選択されてない場合(最初)、一番若いidのコースデータを取得
        if (courseId === null || courseId === undefined || courseId === 0) {
          setCourseId(
            newCourseData.selectCourses
              .filter((course) => course.id > 0)
              .reduce((mincourse, currentCourse) => (currentCourse.id < mincourse.id ? currentCourse : mincourse)).id
          )
        }
        const selectedCourse = courseData.selectCourses.find((course) => course.id === courseId)
        if (selectedCourse) {
          const point = await deserializePoint(selectedCourse.point)
          setPointData(point)
        }

        const res = await fetch(`/api/summary/${competitionId}/${courseId}`, { cache: "no-store" })
        const data = await res.json()
        setCourseSummary(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [competitionId, courseId])

  // 並べ替え機能
  const handleSort = (key: keyof CourseSummary) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortOrder(order)
    const sortedData = [...courseSummary].sort((a, b) => {
      const aValue: number | string =
        key === "playerFurigana" || key === "playerZekken"
          ? a[key] === null
            ? "" // 何も入ってない時に何入れるかは考える余地あり。
            : a[key]
          : a[key] === null
          ? 0
          : +a[key]
      const bValue: number | string =
        key === "playerFurigana" || key === "playerZekken"
          ? b[key] === null
            ? "" // 何も入ってない時に何入れるかは考える余地あり。
            : b[key]
          : b[key] === null
          ? 0
          : +b[key]

      if (order === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    setCourseSummary(sortedData)
  }

  const renderSortIcon = (key: string) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? "▲" : "▼"
    }
    return ""
  }

  const itemTitle = (title1: string, title2?: string, key?: keyof CourseSummary) => {
    return (
      <td className={"border border-gray-400 p-2" + (key && " cursor-pointer")} onClick={() => key && handleSort(key)}>
        <div className="flex-none 2xl:flex flex-row">
          <p>
            {title1} {(!title2 || title2 === "") && key && renderSortIcon(key)}
          </p>
          <p>
            {title2 && title2} {title2 && title2 !== "" && key && renderSortIcon(key)}
          </p>
        </div>
      </td>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="flex mb-5">
        <h1 className="text-3xl font-bold m-2">
          <span className="hidden sm:inline">成績判定シート</span>
          <span className="inline sm:hidden">
            成績判定
            <br />
            シート
          </span>
        </h1>
        <select
          className="select select-bordered m-2"
          onChange={(event) => setCourseId(Number(event.target.value))}
          value={courseId ? courseId : 0}>
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
      <div className="flex m-5 overflow-x-auto 2xl:justify-center 2xl:overflow-x-visible">
        <table className="table table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2">名前</th>
              {itemTitle("ふりがな", "", "playerFurigana")}
              {itemTitle("ゼッケン", "", "playerZekken")}
              {itemTitle("ベーシックコース", "完走なら〇記入")}
              {itemTitle("完走は何回", "で達成?", "firstTCourseCount")}
              {itemTitle("ベーシックコース", "の最高得点", "tCourseMaxResult")}
              {itemTitle("センサーコースの", "最高得点", "sensorMaxResult")}
              {itemTitle("一本橋の", "合計得点", "sumIpponPoint")}
              {itemTitle("一本橋の", "最高得点", "ipponMaxResult")}
              {itemTitle("全てのチャレンジ", "の総得点", "totalPoint")}
              {itemTitle("総得点", "の順位", "pointRank")}
              {itemTitle("チャレンジ", "回数", "challengeCount")}
              {itemTitle("回数の", "順位", "challengeRank")}
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
                  <th className="border border-gray-400 p-2">
                    <Link
                      href={`/summary/${competitionId}/${courseId}/${player.playerId}`}
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 sm:whitespace-nowrap">
                      {player.playerName ? player.playerName : "-"}
                    </Link>
                  </th>
                  <td className="border border-gray-400 p-2 sm:whitespace-nowrap">
                    {player.playerFurigana ? player.playerFurigana : "-"}
                  </td>
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
                  {/* センサーコースはmaxResultにそのまま最高得点が入ってる */}
                  {courseId === -2 && (
                    <td className="border border-gray-400 p-2">
                      {player.sensorMaxResult ? player.sensorMaxResult : "-"}
                    </td>
                  )}
                  <td className="border border-gray-400 p-2">
                    {player.sensorMaxResult ? player.sensorMaxResult : "-"}
                  </td>
                  <td className="border border-gray-400 p-2">{player.sumIpponPoint ? player.sumIpponPoint : "-"}</td>
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
    </div>
  )
}
