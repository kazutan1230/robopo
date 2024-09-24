import { type PointValue } from "@/app/components/course/utils"

export type CourseSummary = {
  playerId: number | null
  playerName: string | null
  playerZekken: string | null
  maxResult: number | null
  challengeCount: number | null
}

// courseのpointStateと各playerのmaxResultからポイント計算する
export const calcPoint = (pointState: PointValue[], maxResult: number | null) => {
  if (maxResult === null) return 0
  let point = Number(pointState[0]) //初期値はstartの値(ハンデ的な)
  for (let i = 2; i < maxResult + 2; i++) {
    point += Number(pointState[i])
    if (i === pointState.length - 1) point += Number(pointState[1]) //goalの点を加算
  }
  return point
}
