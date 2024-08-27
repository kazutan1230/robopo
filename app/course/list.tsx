// import { useState } from "react"
import { getCourses } from "@/app/components/course/list"
import type { SelectCourse } from "@/app/lib/db/schema"

export default async function List(): Promise<JSX.Element> {
    // const [selectedIds, setSelectedIds] = useState<number[]>([])
    const courseData: { selectCourses: SelectCourse[] } = await getCourses()
    // courseDataがうまく取れないことがよくある。↓原因確認用
    // console.log("courseData:", courseData)
    // console.log("courseData.selectCourses:", courseData.selectCourses)
    // console.log("Array.isArray(courseData.selectCourses):", Array.isArray(courseData.selectCourses))


    return (
        <>
            <p>List</p>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>ID</th>
                            <th>コース名</th>
                            <th>作成日時</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseData ? (
                            courseData.selectCourses.map((courses: SelectCourse) => (
                                <tr key={courses.id} className="hover">
                                    <th>
                                        <label>
                                            <input type="checkbox" className="checkbox" />
                                        </label>
                                    </th>
                                    <td>{courses.id}</td>
                                    <td>{courses.name}</td>
                                    <td>{courses.createdAt
                                        ? new Date(courses.createdAt).toLocaleString("ja-JP", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        }) : "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <td colSpan={4}>コースはありません</td>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}