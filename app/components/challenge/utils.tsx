import { SelectPlayer } from "@/app/lib/db/schema"
import { BASE_URL } from "@/app/lib/const"
import { PointState } from "@/app/components/course/utils"

// 選手一覧情報を取得する関数
export async function getPlayerList(): Promise<{
  players: SelectPlayer[]
}> {
  return fetch(`${BASE_URL}/api/player`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) {
        return { players: [] }
      }
      return res.json()
    })
    .then((data) => {
      // ここの形式が色々変わるみたいな気がする。
      // console.log("data: ", data)
      return { players: data.players }
    })
    .catch((err) => {
      console.error("error: ", err)
      return { players: [] } //エラーが発生した場合、空の配列を返す
    })
}

// 進んだmissionの数によって獲得したポイントを計算する
// pointStateは start, goal, mission...の順でポイントが入ってる。
// index = 2からが最初のmissionでそのpointは pointState[2], index = i のポイントは pointState[i]
// 最後のmissionは index = pointState.length-1 になるので、その時は goalのポイント pointState[1]を足す
export const calcPoint = (pointState: PointState, index: number | null) => {
  if (index === null) return 0
  let point = Number(pointState[0]) //初期値はstartの値(ハンデ的な)
  for (let i = 2; i < index + 2; i++) {
    point += Number(pointState[i])
    if (i === pointState.length - 1) point += Number(pointState[1]) //goalの点を加算
  }
  return point
}

// 結果送信
export const resultSubmit = async (
  result1: number,
  result2: number | null,
  compeId: number,
  courseId: number,
  playerId: number,
  umpireId: number,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true)

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
    const data = await response.json()

    console.log(data)
    if (response.ok) {
      setMessage("チャレンジの送信に成功しました")
      setIsSuccess(true)
    } else {
      setMessage("チャレンジの送信に失敗しました")
    }
  } catch (error) {
    console.log("error: ", error)
    setMessage("送信中にエラーが発生しました")
  } finally {
    setLoading(false)
  }
}
