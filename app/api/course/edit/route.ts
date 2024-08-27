import { NextRequest, NextResponse } from "next/server"
import { createCourse } from "@/app/lib/db/queries/insert"
import { db } from "@/app/lib/db/db"
import { course, SelectCourse } from "@/app/lib/db/schema"

export async function GET() {
    const getCourses: SelectCourse[] = await db.select().from(course)
    // console.log("getCourses: ", getCourses)
    return Response.json( {getCourses})
}

export async function POST(req: NextRequest) {
    console.log("req.body: ", req.body)
    const reqbody = await req.json()
    console.log("reqbody: " + reqbody)
    const { name, field, fieldvalid, mission, missionvalid, point } = reqbody
    const courseData = {
        name: name,
        field: field,
        fieldValid: fieldvalid,
        mission: mission,
        missionValid: missionvalid,
        point: point
    }
    console.log("courseData: ", courseData)
    try {
        const result = await createCourse(courseData)
        console.log("result: ", result)
        return NextResponse.json({ success: true, data: result }, { status: 200 })
    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({ success: false, message:"An error occurred while creating the course.", error: error }, { status: 500 })
    }
}