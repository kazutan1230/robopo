import { getUmpireList } from "@/app/components/common/utils"
import type { SelectUmpire } from "@/app/lib/db/schema"
import { View } from "@/app/components/common/view"

export default async function Player() {
  const initialUmpireDataList: { umpires: SelectUmpire[] } = await getUmpireList()

  return <View type="umpire" initialPersonDataList={initialUmpireDataList} />
}
