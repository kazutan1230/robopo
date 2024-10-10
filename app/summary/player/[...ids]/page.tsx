import Link from "next/link"
import {
  getCourseById,
  getCourseSummaryByPlayerId,
  // getMaxResult,
  // getFirstTCourseCount,
  getPlayerById,
} from "@/app/lib/db/queries/queries"
import {
  deserializeMission,
  deserializePoint,
  missionStatePair,
  MissionString,
  panelOrDegree,
} from "@/app/components/course/utils"
import { isCompletedCourse } from "@/app/components/summary/utils"
import { calcPoint } from "@/app/components/challenge/utils"

export default async function SummaryPlayer({ params }: { params: { ids: number[] } }) {
  const ids = params.ids
  // ids[0]:competitionId, ids[1]:courseId, ids[2]:playerId
  // 個人成績を取得する
  const player = await getPlayerById(ids[2])
  const resultArray = await getCourseSummaryByPlayerId(ids[0], ids[1], ids[2])
  // const maxResult = await getMaxResult(ids[0], ids[1], ids[2])
  // const firstTCourseCount = await getFirstTCourseCount(ids[0], ids[1], ids[2])

  // コースデータを取得する
  const course = await getCourseById(ids[1])
  const missionPair = missionStatePair(deserializeMission(course?.mission || ""))
  const point = deserializePoint(course?.point || "")

  const results1: number = resultArray[0].results1
  console.log("resultArray: ", resultArray)
  console.log("resultArray[0].results: ", results1)
  console.log("result1", resultArray[0].results1)

  return (
    <>
      <div className="flex mb-5">
        <h1 className="text-3xl font-bold mr-5 mt-2">個人成績シート</h1>
        <h1 className="text-3xl text-violet-800 font-bold mr-5 mt-2">{player?.name}</h1>
        <h1 className="text-3xl font-bold mr-5 mt-2">{player ? "選手" : ""}</h1>
      </div>
      <h1>{course?.name}コース</h1>
      <div className="flex justify-center">
        <table className="table table-pin-rows">
          <tbody>
            {missionPair.map((pair, index: number) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2">{index + 1}</td>
                <th className="border border-gray-400 p-2">
                  {pair[0] !== null && MissionString[pair[0]]}
                  {pair[1] !== null && [pair[1]]}
                  {pair[0] !== null && panelOrDegree(pair[0])}
                </th>
                <td className="border border-gray-400 p-2">{point[index + 2]}</td>
                {resultArray.map((result) => (
                  <>
                    <td className="border border-gray-400 p-2">{result.results1 > index ? "○" : ""}</td>
                    {result.results2 !== null && (
                      <td className="border border-gray-400 p-2">{result.results2 > index ? "○" : ""}</td>
                    )}
                  </>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="border border-gray-400 p-2 text-center">
                Goal(六足)
              </td>
              <td className="border border-gray-400 p-2">{point[1]}</td>
              {resultArray.map((result) => (
                <>
                  <td className="border border-gray-400 p-2">{isCompletedCourse(point, result.results1) ? "○" : ""}</td>
                  {result.results2 !== null && (
                    <td className="border border-gray-400 p-2">
                      {isCompletedCourse(point, result.results2) ? "○" : ""}
                    </td>
                  )}
                </>
              ))}
            </tr>
            <tr>
              <td colSpan={3} className="border bg-cyan-50 border-gray-400 p-2 text-center">
                コースポイント
              </td>
              {resultArray.map((result) => (
                <>
                  <td className="border border-gray-400 p-2">{calcPoint(point, result.results1)}</td>
                  {result.results2 !== null && (
                    <td className="border border-gray-400 p-2">{calcPoint(point, result.results2)}</td>
                  )}
                </>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto mt-10">
        トップへ戻る
      </Link>
    </>
  )
}
