"use server"

import type { SelectCourse } from "@/app/lib/db/schema"
import { deleteCourseById, getCourseById } from "../lib/db/queries/queries"

const baseUrl: string =
    process.env.API_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000/"

// コース一覧情報を取得する関数
export async function getCourseList(): Promise<{
    selectCourses: SelectCourse[]
}> {
    console.log("https://" + process.env.VERCEL_URL)
    console.log("baseUrl: ", baseUrl)
    return fetch(`${baseUrl}/api/course/list`, { cache: "no-store" })
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
            return { selectCourses: [] } //エラーが発生した場合、空の配列を返す
        })
}

// IDを指定してDBからコースを取得する関数
export const getCourse = async (id: number): Promise<SelectCourse | null> => {
    return fetch(`${baseUrl}/api/course?id=${id}`)
        .then((res) => {
            if (!res.ok) {
                return null
            }
            return res.json()
        })
        .then((data) => {
            return data.getCourse ?? null
        })
        .catch((err) => {
            console.error("Error fetching course: ", err)
            return null // エラーが発生した場合、nullを返す
        })
}

// コースを削除する関数
export const deleteCourse = async (
    formData: FormData
): Promise<{ success: boolean; deletedCount: number; message: string }> => {
    console.log("ids: ", formData)

    const ids = formData.getAll("selectedIds").map((id) => Number(id))
    let deletedCount = 0

    for (const id of ids) {
        try {
            const result = await deleteCourseById(id)

            if (result.length > 0) {
                deletedCount += 1 //削除成功でカウントアップ
            }
            console.log("result: ", result)
        } catch (error) {
            console.log("error: ", error)
        }
    }
    if (ids.length === 0) {
        return {
            success: false,
            deletedCount,
            message: "何も選択されていません",
        }
    }

    const isSuccess = deletedCount === ids.length
    return {
        success: isSuccess,
        deletedCount,
        message: isSuccess
            ? `削除に成功しました。${deletedCount}件のコースが削除されました`
            : `削除に失敗しました。${deletedCount}件のコースが削除されました`,
    }
}
