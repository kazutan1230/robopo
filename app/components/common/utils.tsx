import { SelectCompetition, SelectUmpire, SelectUmpireCourse } from "@/app/lib/db/schema"
import { BASE_URL } from "@/app/lib/const"
import AssignList from "@/app/config/assignList/page"

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

// 大会一覧情報を取得する関数
export async function getCompetitionList(): Promise<{
  competitions: SelectCompetition[]
}> {
  return fetch(`${BASE_URL}/api/competition`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) {
        return { competitions: [] }
      }
      return res.json()
    })
    .then((data) => {
      return { competitions: data.competitions }
    })
    .catch((err) => {
      console.error("error: ", err)
      return { competitions: [] } //エラーが発生した場合、空の配列を返す
    })
}

// コース・採点者割当一覧を取得する関数
export async function getAssignList(): Promise<{
  assigns: SelectUmpireCourse[]
}> {
  return fetch(`${BASE_URL}/api/assign`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) {
        return { assigns: [] }
      }
      return res.json()
    })
    .then((data) => {
      return { assigns: data.assigns }
    })
    .catch((err) => {
      console.error("error: ", err)
      return { assigns: [] } //エラーが発生した場合、空の配列を返す
    })
}
