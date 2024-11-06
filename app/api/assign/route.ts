import { insertUmpireCourse } from "@/app/lib/db/queries/insert"
import { NextRequest, NextResponse } from "next/server"

export const revalidate = 0

// 割り当てられた大会・コース・採点者一覧を取得(予定)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rawId = searchParams.get("id")
  const id = rawId ? parseInt(rawId) : 0

  if (id !== 0) {
    return NextResponse.json({ getCourse: null })
  } else {
    return NextResponse.json({ getCourse: null })
  }
}

export async function POST(req: NextRequest) {
  const reqbody = await req.json()
  const { competitionId, courseId, umpireId } = reqbody
  const data = {
    competitionId: competitionId,
    courseId: courseId,
    umpireId: umpireId,
  }
  try {
    const result = await insertUmpireCourse(data)
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.log("error: ", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the course.",
        error: error,
      },
      { status: 500 }
    )
  }
}
