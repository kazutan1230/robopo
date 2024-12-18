import { NextResponse } from "next/server"
import { openCompetitionById, closeCompetitionById } from "@/app/lib/db/queries/queries"
import { getCompetitionList } from "@/app/components/common/utils"

export const revalidate = 0

export async function POST(req: Request, props: { params: Promise<{ id: number }> }) {
  const { id } = await props.params
  const { type } = await req.json()

  if (type === "open") {
    const result = await openCompetitionById(id)
    const newList = await getCompetitionList()
    return NextResponse.json({ success: true, data: result, newList: newList }, { status: 200 })
  } else if (type === "close") {
    const result = await closeCompetitionById(id)
    const newList = await getCompetitionList()
    return NextResponse.json({ success: true, data: result, newList: newList }, { status: 200 })
  }
}
