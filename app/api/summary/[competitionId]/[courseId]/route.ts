import { NextResponse } from "next/server"
import { getCourseSummary } from "@/app/lib/db/queries/queries"

export const revalidate = 0

export async function GET(req: Request, { params }: { params: { competitionId: string; courseId: string } }) {
  const competitionId = parseInt(params.competitionId)
  const courseId = parseInt(params.courseId)

  // データ取得
  const courseSummary = await getCourseSummary(competitionId, courseId)

  return NextResponse.json(courseSummary)
}
