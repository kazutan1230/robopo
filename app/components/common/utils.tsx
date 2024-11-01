import { SelectUmpire } from "@/app/lib/db/schema"
import { BASE_URL } from "@/app/lib/const"

// 採点者一覧情報を取得する関数
export async function getUmpireList(): Promise<{
  umpires: SelectUmpire[]
}> {
  return fetch(`${BASE_URL}/api/umpire`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) {
        return { umpires: [] }
      }
      return res.json()
    })
    .then((data) => {
      // ここの形式が色々変わるみたいな気がする。
      // console.log("data: ", data)
      return { umpires: data.umpires }
    })
    .catch((err) => {
      console.error("error: ", err)
      return { umpires: [] } //エラーが発生した場合、空の配列を返す
    })
}
