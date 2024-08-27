import type { SelectCourse } from "@/app/lib/db/schema"

export function getCourses():Promise<{ selectCourses: SelectCourse[] }> {
    const baseUrl: string = process.env.API_URL || "http://localhost:3000"

    return fetch(`${baseUrl}/api/course/edit`)
        .then((res) => {
            if (!res.ok) {
                return { selectCourses: [] }
            }
            return res.json()
        })
        .then((data) => {
            // ここの形式が色々変わるみたいな気がする。
            // console.log("data: ", data)
            return { selectCourses: data.getCourses }
        })
        .catch((err) => {
            console.error("error: ", err)
            throw new Error(err)
        })
}