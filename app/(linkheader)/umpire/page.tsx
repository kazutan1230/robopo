import { getUmpireWithCompetition, groupByUmpire } from "@/app/lib/db/queries/queries"
import type { SelectUmpire, SelectUmpireWithCompetition } from "@/app/lib/db/schema"
import { View } from "@/app/components/common/view"

export default async function Player() {
  const initialUmpireDataList: SelectUmpireWithCompetition[] = await groupByUmpire(await getUmpireWithCompetition())

  return <View type="umpire" initialCommonDataList={initialUmpireDataList} />
}
