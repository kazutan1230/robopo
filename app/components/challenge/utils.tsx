import { SelectPlayer } from "@/app/lib/db/schema"
import { BASE_URL } from "@/app/lib/const"

// コース一覧情報を取得する関数
export async function getPlayerList(): Promise<{
  players: SelectPlayer[]
}> {
  console.log("fetch in getCourseList BASE_URL: ", BASE_URL)
  return fetch(`${BASE_URL}/api/player`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) {
        return { players: [] }
      }
      return res.json()
    })
    .then((data) => {
      // ここの形式が色々変わるみたいな気がする。
      //   console.log("data: ", data)
      return { players: data.players }
    })
    .catch((err) => {
      console.error("error: ", err)
      return { players: [] } //エラーが発生した場合、空の配列を返す
    })
}
