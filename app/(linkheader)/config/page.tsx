import { getCompetitionList, getUmpireList } from "@/app/components/common/utils"
import { getCourseList } from "@/app/components/course/listUtils"
import { SelectCompetition, SelectCourse, SelectUmpire } from "@/app/lib/db/schema"
import View from "@/app/(linkheader)/config/view"

export const revalidate = 0

export default async function Config() {
  const initialCompetitionList: { competitions: SelectCompetition[] } = await getCompetitionList()
  const courseList: { selectCourses: SelectCourse[] } = await getCourseList()
  const umpireList: { umpires: SelectUmpire[] } = await getUmpireList()

  return <View initialCompetitionList={initialCompetitionList} courseList={courseList} umpireList={umpireList} />
}
