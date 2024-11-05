import { getCompetitionList } from "@/app/components/common/utils"
import { SelectCompetition } from "@/app/lib/db/schema"
import View from "@/app/config/view"

export const revalidate = 0

export default async function Config() {
  const initialCompetitionList: { competitions: SelectCompetition[] } = await getCompetitionList()

  return <View initialCompetitionList={initialCompetitionList} />
}
