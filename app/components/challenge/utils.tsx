import { SelectPlayer } from "@/app/lib/db/schema"
import { BASE_URL } from "@/app/lib/const"
import { PointState } from "@/app/components/course/util"

// コース一覧情報を取得する関数
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
// index = 0からが最初のmissionでそのpointは pointState[2], index = i のポイントは pointState[i+2]
// 最後のmissionは index = pointState.length-3 になるので、その時は goalのポイント pointState[1]を足す
// indexが合わない時は null 返しているが変更するかも。
export const calcPoint = (pointState: PointState, index: number) => {
  if (index > pointState.length - 2) return null
  let point = 0
  for (let i = 0; i <= index; i++) {
    point += Number(pointState[i + 2])
    if (i === pointState.length - 3) point += Number(pointState[1])
  }
  return point
}
