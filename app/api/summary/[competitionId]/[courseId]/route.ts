import { NextResponse } from "next/server"
import { getPlayerStats } from "@/app/lib/db/queries/tablequeries" // クエリ関数をインポート

export const revalidate = 0

export async function GET(req: Request, { params }: { params: { competitionId: string; courseId: string } }) {
  const competitionId = parseInt(params.competitionId)
  const courseId = parseInt(params.courseId)

  // データ取得
  const playerStats = await getPlayerStats(competitionId, courseId)

  return NextResponse.json(playerStats)
}
