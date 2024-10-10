import { NextRequest, NextResponse } from "next/server"
import { db } from "@/app/lib/db/db"
import { player, SelectPlayer } from "@/app/lib/db/schema"
import { createPlayer } from "@/app/lib/db/queries/insert"
import { deletePlayerById } from "@/app/lib/db/queries/queries"

export const revalidate = 0

export async function GET(request: NextRequest) {
  const players: SelectPlayer[] = await db.select().from(player)
  return Response.json({ players })
}

export async function POST(req: NextRequest) {
  const reqbody = await req.json()
  const { name, furigana, zekken, qr } = reqbody
  const courseData = {
    name: name,
    furigana: furigana,
    zekken: zekken,
    qr: qr,
  }
  try {
    const result = await createPlayer(courseData)
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

export async function DELETE(req: NextRequest) {
  const reqbody = await req.json()
  const { id } = reqbody
  try {
    const result = await deletePlayerById(id)
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
