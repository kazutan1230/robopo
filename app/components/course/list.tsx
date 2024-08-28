"use client"

import type { SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"
import { getCourses, deleteCourse } from "@/app/course/listUtils"

export const List = () => {
    const [courseData, setCourseData] = useState<{ selectCourses: SelectCourse[] } >({ selectCourses: [] })
    useEffect(() => {
        async function fetchCourses() {
            const newCourseData: { selectCourses: SelectCourse[] }  = await getCourses()
            setCourseData(newCourseData)
        }
        fetchCourses()
    }, [])

    // 削除ボタンの動作
    const formAction = async (formData: FormData) => {
        const result = await deleteCourse(formData)
        const newCourseData: { selectCourses: SelectCourse[] }  = await getCourses()
        console.log("newCourseData: ", newCourseData)
        setCourseData(newCourseData)
        alert(result.message)
    }

    return (
        <>
            <form
                // onSubmit={handleSubmit}
                action={formAction}
            >
                <div className="grid grid-cols-2">
                    <div><p>List</p></div>
                    <div><button type="submit" className="btn btn-warning">選択したコースを削除</button></div>
                </div>
                
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
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    name="selectedIds"
                                                    value={courses.id}
                                                />
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
            </form>
        </>
    )
}