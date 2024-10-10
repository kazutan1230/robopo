import { NextResponse } from "next/server"
import { getCourseById, getCourseSummary } from "@/app/lib/db/queries/queries"
import type { CourseSummary } from "@/app/components/summary/utils"
import { deserializePoint } from "@/app/components/course/utils"
import { calcPoint } from "@/app/components/challenge/utils"

export const revalidate = 0

export async function GET(req: Request, { params }: { params: { competitionId: string; courseId: string } }) {
  const competitionId = parseInt(params.competitionId)
  const courseId = parseInt(params.courseId)

  // データ取得
  const courseSummary = await getCourseSummary(competitionId, courseId)
  const course = await getCourseById(courseId)
  const pointState = deserializePoint(course && course.point)

  // 各プレイヤーの総得点を計算
  const courseSummaryWithPoints = courseSummary.map((player) => ({
    ...player,
    totalPoint:
      calcPoint(pointState, player.tCourseMaxResult) + (player.sensorMaxResult || 0) + (player.ipponMaxResult || 0) ||
      0,
  }))
  // 総得点の順位を計算
  const sortedByTotalPoints = [...courseSummaryWithPoints].sort((a, b) => b.totalPoint - a.totalPoint)
  sortedByTotalPoints.forEach((player, index) => {
    player.pointRank = index + 1 // 総得点の順位
  })

  // チャレンジ回数の順位を計算
  const sortedByChallengeCount = [...courseSummaryWithPoints].sort(
    (a, b) => (b.challengeCount || 0) - (a.challengeCount || 0)
  )
  sortedByChallengeCount.forEach((player, index) => {
    player.challengeRank = index + 1 // チャレンジ回数の順位
  })

  // レスポンスの構築
  const resbody: CourseSummary[] = courseSummaryWithPoints.map((player) => ({
    ...player,
    totalPoint: player.totalPoint, // 総得点
    pointRank: player.pointRank, // 総得点の順位
    challengeRank: player.challengeRank, // チャレンジ回数の順位
  }))

  return NextResponse.json(resbody)
}
