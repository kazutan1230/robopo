"use server"

import type { SelectCourse } from "@/app/lib/db/schema"
import { db } from "@/app/lib/db/db"
import { course } from "@/app/lib/db/schema"
import { eq } from "drizzle-orm"

// コース一覧情報を取得する関数
export async function getCourses():Promise<{ selectCourses: SelectCourse[] }> {
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
            return { selectCourses: [] } //エラーが発生した場合、空の配列を返す
        })
}

// IDを指定してDBからコースを削除する関数
const deleteById = async (id: number) => {
    const result = await db
        .delete(course)
        .where(eq(course.id, id))
        .returning({ deleatedId: course.id })

    return result
}

// コースを削除する関数
export const deleteCourse = async (formData: FormData): Promise<{ success: boolean, deletedCount: number, message: string }> => {
    console.log("ids: ", formData)

    const ids = formData.getAll("selectedIds").map(id => Number(id))
    let deletedCount = 0

    for (const id of ids) {
        try {
            const result = await deleteById(id)

            if(result.length > 0) {
                deletedCount += 1 //削除成功でカウントアップ
            }
            console.log("result: ", result)
        } catch (error) {
            console.log("error: ", error)
        }

    }
    if (ids.length === 0) {
        return { success: false, deletedCount, message: "何も選択されていません" }
    }

    const isSuccess = deletedCount === ids.length
    return {
        success: isSuccess,
        deletedCount,
        message: (isSuccess ?
            `削除に成功しました。${deletedCount}件のコースが削除されました` :
            `削除に失敗しました。${deletedCount}件のコースが削除されました`) }
}