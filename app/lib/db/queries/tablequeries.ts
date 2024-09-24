import { eq, and, sql } from "drizzle-orm"
import { db } from "@/app/lib/db/db" // データベース接続のセットアップ
import { player, challenge, course } from "@/app/lib/db/schema"

// 特定の competition_id と course_id に基づくデータを取得
export const getPlayerStats = async (competitionId: number, courseId: number) => {
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
