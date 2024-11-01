import { getUmpireList } from "@/app/components/common/utils"
import type { SelectUmpire } from "@/app/lib/db/schema"
import { View } from "@/app/player/view"

export default async function Player() {
  const initialumpireDataList: { umpires: SelectUmpire[] } = await getUmpireList()

  return <View type="umpire" initialPersonDataList={initialumpireDataList} />
}
