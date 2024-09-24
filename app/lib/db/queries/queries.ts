import { CourseSummary } from "@/app/components/summary/utils"
import { db } from "@/app/lib/db/db"
import { course, SelectCourse, player, challenge } from "@/app/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

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

// IDを指定してDBからChallengeを削除する関数
export const deleteChallengeById = async (id: number) => {
  const result = await db.delete(challenge).where(eq(challenge.id, id)).returning({ deleatedId: challenge.id })
  return result
}

// 特定の competition_id と course_id に基づくデータを取得
export const getCourseSummary = async (competitionId: number, courseId: number) => {
  // SQLで結合し、result1 の最大値と result2 の集計結果を取得
  const result = await db
    .select({
      playerId: player.id,
      playerName: player.name,
      playerZekken: player.zekken,
      maxResult: sql`GREATEST(MAX(${challenge.result1}), MAX(${challenge.result2}))`.as("maxResult"),
      challengeCount: sql`SUM(CASE WHEN ${challenge.result2} IS NULL THEN 1 ELSE 2 END)`.as("challengeCount"),
    })
    .from(player)
    .where(and(eq(challenge.competitionId, competitionId), eq(challenge.courseId, courseId)))
    .leftJoin(challenge, eq(player.id, challenge.playerId))
    .groupBy(player.id)
    .orderBy(player.id)
  return result
}
