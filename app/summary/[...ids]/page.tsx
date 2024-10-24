import React from "react"
import Link from "next/link"
import {
  getCourseById,
  getCourseSummaryByPlayerId,
  getMaxResult,
  getFirstCount,
  getPlayerById,
  getChallengeCount,
} from "@/app/lib/db/queries/queries"
import { deserializeMission, deserializePoint, missionStatePair } from "@/app/components/course/utils"
import { isCompletedCourse } from "@/app/components/summary/utils"
import { sumIpponPoint } from "@/app/components/summary/utilServer"
import { calcPoint } from "@/app/components/challenge/utils"
import { TCourseTable } from "@/app/summary/[...ids]/tCourseTable"

export const revalidate = 0

export default async function SummaryPlayer({ params }: { params: { ids: number[] } }) {
  const { ids } = await params
  // ids[0]:competitionId, ids[1]:courseId, ids[2]:playerId
  // 個人成績を取得する
  const player = await getPlayerById(ids[2])

  const resultArray = await getCourseSummaryByPlayerId(ids[0], ids[1], ids[2])
  const firstTCourseCount = await getFirstCount(ids[0], ids[1], ids[2])
  const maxResult: { maxResult: number }[] = await getMaxResult(ids[0], ids[1], ids[2])

  const resultIpponArray = await getCourseSummaryByPlayerId(ids[0], -1, ids[2])
  const firstIpponCount = await getFirstCount(ids[0], -1, ids[2])
  const maxIpponResult: { maxResult: number }[] = await getMaxResult(ids[0], -1, ids[2])

  const resultSensorArray = await getCourseSummaryByPlayerId(ids[0], -2, ids[2])
  const maxSensorResult: { maxResult: number }[] = await getMaxResult(ids[0], -2, ids[2])

  const challengeCount = await getChallengeCount(ids[0], ids[1], ids[2])

  // コースデータを取得する
  const course = await getCourseById(ids[1])
  const missionPair = missionStatePair(deserializeMission(course?.mission || ""))
  const point = deserializePoint(course?.point || "")

  // 一本橋のデータを取得する
  const ipponBashi = await getCourseById(-1)
  const ipponPoint = deserializePoint(ipponBashi?.point || "")

  // 一本橋コースで得た総得点
  const sumIpponPoints = await sumIpponPoint(ids[0], ids[2])

  return (
    <>
      <div className="flex mb-5">
        <h1 className="text-3xl font-bold mr-5 mt-2">個人成績シート</h1>
        <h1 className="text-3xl text-violet-800 font-bold mr-5 mt-2">{player?.name}</h1>
        <h1 className="text-3xl font-bold mr-5 mt-2">{player ? "選手" : ""}</h1>
      </div>
      <div className="divider">{course?.name}コース</div>

      <TCourseTable
        missionPair={missionPair}
        point={point}
        resultArray={resultArray}
        firstTCourseCount={firstTCourseCount}
        maxResult={maxResult}
      />

      <div className="divider">THE一本橋</div>
      <div className="flex justify-center">
        <table className="table table-pin-rows">
          <tbody>
            <tr className="flex flex-row">
              {resultIpponArray.map((result, index: number) => (
                <React.Fragment key={index}>
                  <td className="border border-gray-400 p-2">{calcPoint(ipponPoint, result.results1)}</td>
                  {result.results2 !== null && (
                    <td className="border border-gray-400 p-2">{calcPoint(ipponPoint, result.results2)}</td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid justify-end m-3">
        <table className="table table-pin-rows">
          <tbody>
            <tr>
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center">一本橋の合計得点</td>
              <td className="border border-gray-400 p-2">{maxIpponResult.length > 0 ? sumIpponPoints : "-"}</td>
              {/* <td className="border border-gray-400 p-2">{maxIpponResult.length > 0 ? sumIppon : "-"}</td> */}
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center">成功までの回数</td>
              <td className="border border-gray-400 p-2">
                {maxIpponResult.length > 0 && isCompletedCourse(ipponPoint, maxIpponResult[0].maxResult)
                  ? firstIpponCount[0].firstCount
                  : "-"}
              </td>
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center">MAXポイント</td>
              <td className="border border-gray-400 p-2">
                {maxIpponResult.length > 0 ? calcPoint(ipponPoint, maxIpponResult[0].maxResult) : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="divider">センサーコース</div>
      <div className="flex justify-center">
        <table className="table table-pin-rows">
          <tbody>
            <tr className="flex flex-row">
              {resultSensorArray.map((result, index: number) => (
                <React.Fragment key={index}>
                  <td className="border border-gray-400 p-2">{result.results1}</td>
                  {result.results2 !== null && <td className="border border-gray-400 p-2">{result.results2}</td>}
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid justify-end m-3">
        <table className="table table-pin-rows">
          <tbody>
            <tr>
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center">MAXポイント</td>
              <td className="border border-gray-400 p-2">
                {maxSensorResult.length > 0 ? maxSensorResult[0].maxResult : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="divider">試行回数</div>
      <div className="grid justify-end m-3">
        <table className="table table-pin-rows">
          <tbody>
            <tr>
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center">トータル回数</td>
              <td className="border border-gray-400 p-2">{challengeCount[0].challengeCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid justify-end m-3">
        <table className="table table-pin-rows">
          <tbody>
            <tr>
              <td className="border bg-cyan-50 border-gray-400 p-2 text-center text-2xl">トータルポイント</td>
              <td className="border border-gray-400 p-2 text-2xl">
                {(maxResult.length > 0 ? calcPoint(point, maxResult[0].maxResult) : 0) +
                  (maxIpponResult.length > 0 ? calcPoint(ipponPoint, maxIpponResult[0].maxResult) : 0) +
                  (maxSensorResult.length > 0 ? maxSensorResult[0].maxResult : 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link href="/summary" className="btn btn-primary min-w-28 max-w-fit mx-auto m-3">
        集計結果一覧へ戻る
      </Link>
      <Link href="/" className="btn btn-primary min-w-28 max-w-fit mx-auto ml-3">
        トップへ戻る
      </Link>
    </>
  )
}
