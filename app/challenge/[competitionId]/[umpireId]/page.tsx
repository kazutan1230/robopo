import { getCourseList } from "@/app/components/course/listUtils"
import { getPlayerList } from "@/app/components/challenge/utils"
import type { SelectCourse, SelectPlayer } from "@/app/lib/db/schema"
import { View } from "@/app/challenge/view"

export default async function Challenge({ params }: { params: { competitionId: number; umpireId: number } }) {
  const courseDataList: { selectCourses: SelectCourse[] } = await getCourseList()
  const initialPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()

  const { competitionId, umpireId } = params

  return (
    <View
      courseDataList={courseDataList}
      initialPlayerDataList={initialPlayerDataList}
      //   compeId={competitionId}
      //   umpireId={umpireId}
    />
  )
}
