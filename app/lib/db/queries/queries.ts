import { db } from "@/app/lib/db/db"
import { course, SelectCourse } from "@/app/lib/db/schema"
import { eq } from "drizzle-orm"

// IDを指定してDBからコースを削除する関数
// @/app/lib/db/queries/delete.tsを作成して移動させる方がいいかもしれない。
export const deleteCourseById = async (id: number) => {
	const result = await db
		.delete(course)
		.where(eq(course.id, id))
		.returning({ deleatedId: course.id })
	return result
}

// コースをIDから取得する関数
export const getCourseById = async (
	id: number
): Promise<SelectCourse | null> => {
	const result = await db
		.select()
		.from(course)
		.where(eq(course.id, id))
		.limit(1)

	return result.length > 0 ? result[0] : null
}
