"use client"

import { useState } from "react"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import { TableExample } from "@/app/summary/tableExample"

type ViewProps = {
  courseDataList: { selectCourses: SelectCourse[] }
  playerDataList: { players: SelectPlayer[] }
}

export const View = ({ courseDataList, playerDataList }: ViewProps) => {
  const [step, setStep] = useState(0)
  const [courseId, setCourseId] = useState<number | null>(null)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [playerData, setPlayerDataList] = useState<SelectPlayer[]>(playerDataList.players)
  const competitionId: number = 1 //一旦1
  const umpireId: number = 1 //一旦1

  return <TableExample competitionId={competitionId} courseId="55" />
}
