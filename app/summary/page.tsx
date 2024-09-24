import { getCourseList } from "@/app/components/course/listUtils"
import { getPlayerList } from "@/app/components/challenge/utils"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import { View } from "@/app/summary/view"

export default async function Summary() {
  const courseDataList: { selectCourses: SelectCourse[] } = await getCourseList()
  const playerDataList: { players: SelectPlayer[] } = await getPlayerList()

  return <View courseDataList={courseDataList} playerDataList={playerDataList} />
}
