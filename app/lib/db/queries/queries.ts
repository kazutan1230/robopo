import { CourseSummary } from "@/app/components/summary/utils"
import { db } from "@/app/lib/db/db"
import { course, SelectCourse, player, challenge, competition } from "@/app/lib/db/schema"
import { eq, sql, and } from "drizzle-orm"

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
// firstTCourseCountはresult1とresult2から最大のものを取得し、
// それまで(created_atとidを昇順に並べた際の古いもの)のresult1とresult2の個数を最大のものが出るまで足している。
// 完走してない時もその時点で最大のresultまでの回数が出るので、完走したかどうかで表示非表示を変える必要がある。
export const getCourseSummary = async (competitionId: number, courseId: number): Promise<CourseSummary[]> => {
  const result = await db
    .select({
      playerId: player.id,
      playerName: player.name,
      playerFurigana: player.furigana,
      playerZekken: player.zekken,
      firstTCourseCount: sql`
        (SELECT SUM(attempts_up_to_max) FROM (
          SELECT ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS attempt_number,
          GREATEST(result1, COALESCE(result2, 0)) AS result,
          CASE WHEN result1 IS NOT NULL THEN 1 ELSE 0 END + CASE WHEN result2 IS NOT NULL THEN 1 ELSE 0 END AS attempts_up_to_max
          FROM challenge
          WHERE player_id = ${player.id}
          AND course_id = ${courseId}
          AND (result1 IS NOT NULL OR result2 IS NOT NULL)
        ) AS RankedAttempts
          WHERE attempt_number <= (
            SELECT MIN(attempt_number) 
            FROM (
              SELECT ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS attempt_number,
              GREATEST(result1, COALESCE(result2, 0)) AS result
              FROM challenge
              WHERE player_id = ${player.id}
              AND course_id = ${courseId}
              AND competition_id = ${competitionId}
            ) AS Attempts
            WHERE result = (
              SELECT MAX(GREATEST(result1, COALESCE(result2, 0)))
              FROM challenge
              WHERE player_id = ${player.id}
              AND course_id = ${courseId}
              AND competition_id = ${competitionId}
            )
          )
        )`.as("firstTCourseCount"),
      tCourseCount:
        sql`SUM(CASE WHEN ${challenge.courseId} = ${courseId} THEN (CASE WHEN ${challenge.result2} IS NULL THEN 1 ELSE 2 END) ELSE 0 END)`.as(
          "tCourseCount"
        ),
      tCourseMaxResult:
        sql`MAX(CASE WHEN ${challenge.courseId} = ${courseId} THEN GREATEST(${challenge.result1}, COALESCE(${challenge.result2}, 0)) ELSE NULL END)`.as(
          "tCourseMaxResult"
        ),
      sensorMaxResult:
        sql`MAX(CASE WHEN ${challenge.courseId} = -2 THEN GREATEST(${challenge.result1}, COALESCE(${challenge.result2}, 0)) ELSE NULL END)`.as(
          "sensorMaxResult"
        ),
      ipponMaxResult:
        sql`MAX(CASE WHEN ${challenge.courseId} = -1 THEN GREATEST(${challenge.result1}, COALESCE(${challenge.result2}, 0))ELSE NULL END)`.as(
          "ipponMaxResult"
        ),
      challengeCount: sql`SUM(CASE
            WHEN ${challenge.courseId} = ${courseId} THEN (CASE WHEN ${challenge.result2} IS NULL THEN 1 ELSE 2 END)
            WHEN ${challenge.courseId} = -1 THEN (CASE WHEN ${challenge.result2} IS NULL THEN 1 ELSE 2 END)
            WHEN ${challenge.courseId} = -2 THEN (CASE WHEN ${challenge.result2} IS NULL THEN 1 ELSE 2 END)
            ELSE 0
          END)`.as("challengeCount"),
    })
    .from(player)
    .leftJoin(challenge, eq(player.id, challenge.playerId))
    .where(eq(challenge.competitionId, competitionId))
    .groupBy(player.id)
    .orderBy(player.id)
  return result as CourseSummary[]
}

// competition_id, course_id, player_idから個人成績result配列を取得
export const getCourseSummaryByPlayerId = async (competitionId: number, courseId: number, playerId: number) => {
  // 結果を配列で取得
  const result = await db
    .select({
      // results: challenge.result1,
      results1: challenge.result1,
      results2: challenge.result2,
    })
    .from(challenge)
    .where(
      and(
        eq(challenge.competitionId, competitionId),
        eq(challenge.playerId, playerId),
        eq(challenge.courseId, courseId)
      )
    )
    .orderBy(challenge.id)
    .groupBy(challenge.id)

  return result as { results1: number; results2: number | null }[]
}
