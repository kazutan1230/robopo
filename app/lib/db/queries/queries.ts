import { db } from "@/app/lib/db/db"
import { course, SelectCourse, player } from "@/app/lib/db/schema"
import { eq } from "drizzle-orm"

// IDを指定してDBからコースを削除する関数
// @/app/lib/db/queries/delete.tsを作成して移動させる方がいいかもしれない。
export const deleteCourseById = async (id: number) => {
  const result = await db.delete(course).where(eq(course.id, id)).returning({ deleatedId: course.id })
  return result
}

// コースをIDから取得する関数
export const getCourseById = async (id: number): Promise<SelectCourse | null> => {
  const result = await db.select().from(course).where(eq(course.id, id)).limit(1)

  return result.length > 0 ? result[0] : null
}

// IDを指定してDBからPlayerを削除する関数
export const deletePlayerById = async (id: number) => {
  const result = await db.delete(player).where(eq(player.id, id)).returning({ deleatedId: player.id })
  return result
}

// QRからPlayerを取得する関数
export const getPlayerByQR = async (qr: string) => {
  const result = await db.select().from(player).where(eq(player.qr, qr)).limit(1)
  return result.length > 0 ? result[0] : null
}
// IDからPlayerを取得する関数
export const getPlayerById = async (id: number) => {
  const result = await db.select().from(player).where(eq(player.id, id)).limit(1)
  return result.length > 0 ? result[0] : null
}
