import { getPlayerList } from "@/app/components/challenge/utils"
import type { SelectPlayer } from "@/app/lib/db/schema"
import { View } from "./view"

export default async function Player() {
  const initialPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()

  return <View initialPlayerDataList={initialPlayerDataList} />
}
