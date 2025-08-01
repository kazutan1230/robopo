import type { useRouter } from "next/navigation"
import type React from "react"
import type { PointState } from "@/app/components/course/utils"

// 進んだmissionの数によって獲得したポイントを計算する
// pointStateは start, goal, mission...の順でポイントが入ってる。
// index = 2からが最初のmissionでそのpointは pointState[2], index = i のポイントは pointState[i]
// 最後のmissionは index = pointState.length-1 になるので、その時は goalのポイント pointState[1]を足す
export function calcPoint(pointState: PointState, index: number | null) {
  if (index === null) {
    return 0
  }
  let point = Number(pointState[0]) //初期値はstartの値(ハンデ的な)
  for (let i = 2; i < index + 2; i++) {
    point += Number(pointState[i])
    if (i === pointState.length - 1) {
      point += Number(pointState[1]) //goalの点を加算
    }
  }
  return point
}

// 結果送信
export async function resultSubmit(
  result1: number,
  result2: number | null,
  compeId: number,
  courseId: number,
  playerId: number,
  umpireId: number,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: ReturnType<typeof useRouter>,
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setLoading(true)
  setIsEnabled(false)

  const requestBody = {
    result1: result1,
    result2: result2,
    competitionId: compeId,
    courseId: courseId,
    playerId: playerId,
    umpireId: umpireId,
  }

  try {
    const response = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
    if (response.ok) {
      setMessage("チャレンジの送信に成功しました")
      setIsSuccess(true)
      router.push("/")
    } else {
      setMessage("チャレンジの送信に失敗しました")
    }
  } catch (error) {
    setMessage(`送信中にエラーが発生しました: ${error}`)
  } finally {
    setIsEnabled(true)
    setLoading(false)
  }
}
