import { ThreeTabs } from "@/app/components/parts/threeTabs"
import { CompetitionListTab } from "@/app/config/tabs"
import { getCompetitionList } from "@/app/components/common/utils"
import { SelectCompetition } from "@/app/lib/db/schema"

export const revalidate = 0

export default async function Config() {
  const initialCompetitionList: { competitions: SelectCompetition[] } = await getCompetitionList()

  return (
    <ThreeTabs
      tab1Title="大会一覧"
      tab1={<CompetitionListTab competitions={initialCompetitionList.competitions} />}
      tab2Title="集計結果"
      tab2={<CompetitionListTab competitions={initialCompetitionList.competitions} />}
      tab3Title="大会管理"
      tab3={<CompetitionListTab competitions={initialCompetitionList.competitions} />}
    />
  )
}
